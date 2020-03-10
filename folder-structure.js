var fs = require('fs');
var path = require('path');
var util = require('util');

var logFile = fs.createWriteStream('folder-structure.md', { flags: 'w' });
var logStdout = process.stdout;

console.log = function() {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
};
console.error = console.log;

var FolderNamesArray = [];
// var levels=[0];
var level = 0;
var spacing = '';
console.log('# Folder Structue\n\n```');
function crawl(spacing, dir, level) {
    var folderName = path.basename(dir);
    FolderNamesArray.push(folderName);

    console.log(spacing + "├───" + folderName);

    var files = fs.readdirSync(dir);
    for (var x in files) {
        //ignored folders
        if (files[x] !== '.git' && files[x] !== '.nyc_output'&& files[x] !== 'coverage'&& files[x] !== 'node_modules'&& files[x] !== 'bin'&& files[x] !== 'lib') {
            var next = path.join(dir, files[x]);
            if (fs.lstatSync(next).isDirectory() === true) {
                crawl(spacing + '│' + '   ', next, level + 1);
            }
        }
    }
}
crawl(spacing, __dirname, level);
console.log('```');