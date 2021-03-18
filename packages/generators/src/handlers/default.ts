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
    // Handle JS language solutions
    const { langType } = await Question.List(
        self,
        'langType',
        'Which of the following JS solutions do you want to use?',
        ['none', 'ES6', 'Typescript'],
        'none',
        self.force,
    );

    switch (langType) {
        case 'ES6':
            self.dependencies = [...self.dependencies, 'babel-loader', '@babel/core', '@babel/preset-env'];
            break;
        case 'Typescript':
            self.dependencies = [...self.dependencies, 'typescript', 'ts-loader'];
            break;
    }

    // Configure devServer configuraion
    const { devServer } = await Question.Confirm(self, 'devServer', 'Do you want to webpack-dev-server?', true, self.force);
    if (devServer) {
        self.dependencies = [...self.dependencies, 'webpack-dev-server'];
    }

    // Handle addition of html-webpack-plugin
    const { htmlWebpackPlugin } = await Question.Confirm(
        self,
        'htmlWebpackPlugin',
        'Do you want to simplify the creation of HTML files for your bundle?',
        true,
        self.force,
    );
    if (htmlWebpackPlugin) {
        self.dependencies = [...self.dependencies, 'html-webpack-plugin'];
    }

    // Handle CSS solutions
    const { cssType } = await Question.List(
        self,
        'cssType',
        'Which of the following CSS solutions do you want to use?',
        ['none', 'CSS', 'SASS', 'LESS', 'Stylus'],
        'none',
        self.force,
    );

    switch (cssType) {
        case 'CSS':
            self.dependencies = [...self.dependencies, 'style-loader', 'css-loader'];
            break;
        case 'SASS':
            self.dependencies = [...self.dependencies, 'sass-loader', 'sass'];
            break;
        case 'LESS':
            self.dependencies = [...self.dependencies, 'less-loader', 'less'];
            break;
        case 'Stylus':
            self.dependencies = [...self.dependencies, 'stylus-loader', 'stylus'];
            break;
    }

    // Handle asset modules if we don't have js and css
    if (langType == 'none' && cssType == 'none') {
        const { assetsModules } = await Question.Confirm(
            self,
            'assetsModules',
            'Will you be using assets like images and fonts?',
            true,
            self.force,
        );

        self.answers = { ...self.answers, assetsModules };
    }

    // store all answers for generation
    self.answers = { ...self.answers, langType, devServer, htmlWebpackPlugin, cssType };
}

/**
 * Handles generation of project files
 * @param self Generator values
 */
export function generate(self: CustomGenerator): void {
    self.fs.extendJSON(
        self.destinationPath('package.json'),
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require(resolveFile('package.json.js'))(self.answers.devServer),
    );

    const generateEntryFile = (entryPath: string): void => {
        if (self.answers.langType == 'Typescript') {
            entryPath += 'ts';
        } else {
            entryPath += 'js';
        }
        self.fs.copyTpl(resolveFile('index.js'), self.destinationPath(entryPath));
    };

    // Generate entry file
    const entry = './src/index.';
    generateEntryFile(entry);

    // Generate README
    self.fs.copyTpl(resolveFile('README.md'), self.destinationPath('README.md'), {});

    // Generate HTML template file
    self.fs.copyTpl(resolveFile('template.html'), self.destinationPath('index.html'), {});

    // Generate webpack configuration
    self.fs.copyTpl(resolveFile('webpack.configjs.tpl'), self.destinationPath('webpack.config.js'), self.answers);

    // Generate JS language essentials
    switch (self.answers.langType) {
        case 'ES6':
            self.fs.copyTpl(resolveFile('.babelrc'), self.destinationPath('.babelrc'));
            break;
        case 'Typescript':
            self.fs.copyTpl(resolveFile('tsconfig.json'), self.destinationPath('tsconfig.json'));
            break;
    }
}
