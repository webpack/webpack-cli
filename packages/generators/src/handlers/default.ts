import path from 'path';
import { CustomGenerator } from '../types';

const templatePath = path.resolve(__dirname, '../../init-template/default');
const resolveFile = (file: string): string => {
    return path.resolve(templatePath, file);
};

/**
 * Handles generation of default template
 * @param self Generator values
 */
export default function (self: CustomGenerator): void {
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
    } else if (typeof entry === 'object') {
        Object.keys(entry).forEach((name: string): void => generateEntryFile(entry[name], `${name} main file!`));
    }

    // Generate README
    self.fs.copyTpl(resolveFile('README.md'), self.destinationPath('README.md'), {});

    // Generate HTML template file
    self.fs.copyTpl(resolveFile('template.html'), self.destinationPath('index.html'), {});

    // Generate webpack configuration
    self.fs.copyTpl(resolveFile('webpack.config.js'), self.destinationPath('webpack.config.js'));
}
