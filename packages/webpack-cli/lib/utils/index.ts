import colors from 'colorette';
import levenshtein from 'fastest-levenshtein';
import interpret from 'interpret';
import rechoir from 'rechoir';
import capitalizeFirstLetter from './capitalize-first-letter';
import dynamicImportLoader from './dynamic-import-loader';
import getPackageManager from './get-package-manager';
import logger from './logger';
import packageExists from './package-exists';
import promptInstallation from './prompt-installation';
import runCommand from './run-command';
import toKebabCase from './to-kebab-case';

export default {
    colors,
    levenshtein,
    interpret,
    rechoir,
    capitalizeFirstLetter,
    dynamicImportLoader,
    getPackageManager,
    logger,
    packageExists,
    promptInstallation,
    runCommand,
    toKebabCase,
};

// const utils = {
//     get colors() {
//         return require('colorette');
//     },

//     get levenshtein() {
//         return require('fastest-levenshtein');
//     },

//     get interpret() {
//         return require('interpret');
//     },

//     get rechoir() {
//         return require('rechoir');
//     },

//     get capitalizeFirstLetter() {
//         return require('./capitalize-first-letter');
//     },

//     get dynamicImportLoader() {
//         return require('./dynamic-import-loader');
//     },

//     get getPackageManager() {
//         return require('./get-package-manager');
//     },

//     get logger() {
//         return require('./logger');
//     },

//     get packageExists() {
//         return require('./package-exists');
//     },

//     get promptInstallation() {
//         return require('./prompt-installation');
//     },

//     get runCommand() {
//         return require('./run-command');
//     },

//     get toKebabCase() {
//         return require('./to-kebab-case');
//     },
// };

// export default utils
