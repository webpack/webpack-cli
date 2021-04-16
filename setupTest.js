/*global jasmine*/

jest.setTimeout(300000);

if (!jasmine.testPath.includes('colors.test.js')) {
    process.env.NO_COLOR = true;
}
