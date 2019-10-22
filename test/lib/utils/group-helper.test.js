const { parse, sep } = require('path');
const GroupHelper = require('../../../lib/utils/group-helper');

var GroupHelperOptions, GroupHelperObj, entryPath;

/**
 * It process the entry path came from the output and checks if
 * entry path mentioned in the group helper input is matched or not
 * @param {string} entryPathFromOutput - entry path came from the output of the group helper
 * @param {string} EntryFromGroupHelperInput - entry path passed as an input to the group helper
 * @returns {boolean} - returns whether entry paths are matched or not
 */
const isEntryOuputMatchedInput = (entryPathFromOutput, EntryFromGroupHelperInput) => {
    let dir = parse(entryPathFromOutput).dir;
    let base = parse(entryPathFromOutput).base;
    let entryOutput = dir.concat(`/${base}`).split(sep);
    return entryOutput.join('/').includes(EntryFromGroupHelperInput);
};
describe('group-helper tests', () => {
    describe('resolveFilePath', () => {
        it('should return correct path : sample/entry.js', done => {
            GroupHelperOptions = [{ entry: 'test/lib/utils/sample/entry.js' }, { progress: 'bar' }, { sourcemap: 'eval' }, { dev: false }, { prod: true }];
            GroupHelperObj = new GroupHelper(GroupHelperOptions);
            entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry);
            expect(isEntryOuputMatchedInput(entryPath, GroupHelperOptions[0].entry)).toBe(true);
            done();
        });
        it('should return correct path : sample/entry', done => {
            GroupHelperOptions = [{ entry: 'test/lib/utils/sample/entry' }, { progress: 'bar' }, { sourcemap: 'eval' }, { dev: false }, { prod: true }];
            GroupHelperObj = new GroupHelper(GroupHelperOptions);
            entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry);
            expect(isEntryOuputMatchedInput(entryPath, GroupHelperOptions[0].entry)).toBe(true);
            done();
        });
        it('should return correct path : sample', done => {
            GroupHelperOptions = [{ entry: 'test/lib/utils/sample' }, { progress: 'bar' }, { sourcemap: 'eval' }, { dev: false }, { prod: true }];
            GroupHelperObj = new GroupHelper(GroupHelperOptions);
            entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry);
            expect(isEntryOuputMatchedInput(entryPath, GroupHelperOptions[0].entry)).toBe(true);
            done();
        });
        it('should return correct path : sample/index.js', done => {
            GroupHelperOptions = [{ entry: 'test/lib/utils/sample/index.js' }, { progress: 'bar' }, { sourcemap: 'eval' }, { dev: false }, { prod: true }];
            GroupHelperObj = new GroupHelper(GroupHelperOptions);
            entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry);
            expect(isEntryOuputMatchedInput(entryPath, GroupHelperOptions[0].entry)).toBe(true);
            done();
        });
        it('should return correct path : sample/index', done => {
            GroupHelperOptions = [{ entry: 'test/lib/utils/sample/index' }, { progress: 'bar' }, { sourcemap: 'eval' }, { dev: false }, { prod: true }];
            GroupHelperObj = new GroupHelper(GroupHelperOptions);
            entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry);
            expect(isEntryOuputMatchedInput(entryPath, GroupHelperOptions[0].entry)).toBe(true);
            done();
        });
    });
});
