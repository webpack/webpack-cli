const fs = require('fs');
const path = require('path');
const util = require('util');
const directoryName = require('path').resolve(__dirname, '..');

var logFile = fs.createWriteStream('folder-structure.md', { flags: 'w' });
var logStdout = process.stdout;

console.log = function buildingStructure() {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
};
console.error = console.log;

var folderNamesArray = [];
var level = 0;
var spacing = '';
var descriptionSpacing = '';
var description = '';

console.log('# Folder Structue\n\n```');
function crawl(spacing, dir, level) {
    var folderName = path.basename(dir);
    folderNamesArray.push(folderName);

    // if(folderName==="webpack-cli"){
    //     description=""
    // }

    var structure = spacing + '├───' + folderName;
    var structureLength = structure.length;
    var descriptionSpacingLength = 50 - structureLength;
    descriptionSpacing = '';
    for (var i = 0; i < descriptionSpacingLength; i++) {
        descriptionSpacing += ' ';
    }

    console.log(structure + descriptionSpacing + description);

    var files = fs.readdirSync(dir);
    for (var x in files) {
        //ignored folders
        const blacklist = ['.git', '.nyc_output', 'coverage', 'node_modules', 'bin', 'lib'];
        if (!blacklist.includes(files[x])) {
            switch (files[x]) {
                case '.github':
                    description = '## Contains files required by Github for proper workflow';
                    break;
                case 'docs':
                    description = '## Documents explaining Webpack Functions';
                    break;
                case 'packages':
                    description = '## Contains webpack-cli packages';
                    break;
                case 'generate-plugins':
                    description = '## This contains the logic to initiate new plugin projects';
                    break;
                case 'generate-loader':
                    description = '## This contains the logic to initiate new loader projects';
                    break;
                case 'generators':
                    description = '## This contains all webpack-cli related yeoman generators';
                    break;
                case 'init':
                    description = '## This contains the logic to create a new webpack configuration';
                    break;
                case 'logger':
                    description = '## webpack CLI logger';
                    break;
                case 'migrate':
                    description = '## This contains the logic to migrate a project from one version to the other';
                    break;
                case 'package-utils':
                    description = '## To manage packages and modules';
                    break;
                case 'webpack-scaffold':
                    description = '## It contains utility functions to help you work with Inquirer prompting and scaffolding';
                    break;
                case 'smoketests':
                    description = '## It contains minimal set of tests run on each build';
                    break;
                default:
                    description = ' ';
            }

            var next = path.join(dir, files[x]);
            if (fs.lstatSync(next).isDirectory()) {
                crawl(spacing + '│' + '   ', next, level + 1);
            }
        }
    }
}
crawl(spacing, directoryName, level);
console.log('```');
