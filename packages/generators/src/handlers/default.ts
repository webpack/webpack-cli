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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export async function questions(self: CustomGenerator, Question: any[]): Promise<void> {
    // TODO: implement it for css and js lang options
    return;
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

    const generateEntryFile = (entryPath: string, name: string): void => {
        entryPath = entryPath.replace(/'/g, '');
        self.fs.copyTpl(resolveFile('index.js'), self.destinationPath(entryPath), { name });
    };

    // Generate entry file/files
    const entry = './src/index.js';
    if (typeof entry === 'string') {
        generateEntryFile(entry, 'your main file!');
    }

    // Generate README
    self.fs.copyTpl(resolveFile('README.md'), self.destinationPath('README.md'), {});

    // Generate HTML template file
    self.fs.copyTpl(resolveFile('template.html'), self.destinationPath('index.html'), {});

    // Generate webpack configuration
    self.fs.copyTpl(resolveFile('webpack.config.ejs'), self.destinationPath('webpack.config.js'));
}
