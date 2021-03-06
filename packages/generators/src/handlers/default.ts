import path from 'path';
import { CustomGenerator } from '../types';

const templatePath = path.resolve(__dirname, '../../init-template/default');
const resolveFile = (file: string): string => {
    return path.resolve(templatePath, file);
};

/**
 * Asks questions to the user used to modify generation
 * @param self Generator values
 * @param Question Contains questions
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function questions(self: CustomGenerator, Question: Record<string, any>): Promise<void> {
    // TODO: implement it for css lang options
    const { jsLang } = await Question.List(
        self,
        'jsLang',
        'Which of the following JS solutions do you want to use?',
        ['none', 'ES6', 'Typescript'],
        'none',
        self.useDefaults,
    );

    // Add dependencies for js lang
    switch (jsLang) {
        case 'ES6':
            self.dependencies = [...self.dependencies, 'babel-loader', '@babel/core', '@babel/preset-env'];
            break;
        case 'Typescript':
            self.dependencies = [...self.dependencies, 'typescript', 'ts-loader'];
            break;
    }

    const { devServer } = await Question.Confirm(self, 'devServer', 'Do you want to webpack-dev-server?', true, self.useDefaults);
    if (devServer) {
        self.dependencies = [...self.dependencies, 'webpack-dev-server'];
    }

    self.answers = { ...self.answers, jsLang, devServer };
}

/**
 * Handles generation of default template
 * @param self Generator values
 */
export function generate(self: CustomGenerator): void {
    const isUsingDevServer = self.dependencies.includes('webpack-dev-server');
    const packageJsonTemplatePath = resolveFile('package.json.js');
    self.fs.extendJSON(
        self.destinationPath('package.json'),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(packageJsonTemplatePath)(isUsingDevServer),
    );

    const generateEntryFile = (entryPath: string): void => {
        entryPath = entryPath.replace(/'/g, '');
        if (self.answers.jsLang == 'Typescript') {
            entryPath += 'ts';
        } else {
            entryPath += 'js';
        }
        self.fs.copyTpl(resolveFile('index.js'), self.destinationPath(entryPath));
    };

    // Generate entry file/files
    const entry = './src/index.';
    if (typeof entry === 'string') {
        generateEntryFile(entry);
    }

    // Generate README
    self.fs.copyTpl(resolveFile('README.md'), self.destinationPath('README.md'), {});

    // Generate HTML template file
    self.fs.copyTpl(resolveFile('template.html'), self.destinationPath('index.html'), {});

    // Generate webpack configuration
    self.fs.copyTpl(resolveFile('webpack.configjs.tpl'), self.destinationPath('webpack.config.js'), {
        lang: self.answers.jsLang,
    });

    // Generate JS language essentials
    switch (self.answers.jsLang) {
        case 'ES6':
            self.fs.copyTpl(resolveFile('.babelrc'), self.destinationPath('.babelrc'));
            break;
        case 'Typescript':
            self.fs.copyTpl(resolveFile('tsconfig.json'), self.destinationPath('tsconfig.json'));
            break;
    }
}
