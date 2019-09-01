const { parse, sep } = require('path')
const GroupHelper = require('../group-helper');

describe('group-helper tests', () => {
    describe('resolveFilePath', () => {
        it('should return correct path : sample/entry.js', done => {
            const GroupHelperOptions = [
                { entry: 'lib/utils/test/sample/entry.js' },
                { progress: 'bar' },
                { sourcemap: 'eval' },
                { dev: false },
                { prod: true }
            ]
            const GroupHelperObj = new GroupHelper(GroupHelperOptions);
            const entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry)
            const { dir, base } = parse(entryPath);
            const entryOutput = dir.split(sep).concat(base);
            expect(entryOutput.join('/').includes(GroupHelperOptions[0].entry)).toBe(true)
            done();

        })
        it('should return correct path : sample/entry', done => {

            const GroupHelperOptions = [
                { entry: 'lib/utils/test/sample/entry' },
                { progress: 'bar' },
                { sourcemap: 'eval' },
                { dev: false },
                { prod: true }
            ]
            const GroupHelperObj = new GroupHelper(GroupHelperOptions);
            const entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry)
            const { dir, base } = parse(entryPath);
            const entryOutput = dir.split(sep).concat(base);
            expect(entryOutput.join('/').includes(GroupHelperOptions[0].entry)).toBe(true)
            done();

        })
        it('should return correct path : sample', done => {

            const GroupHelperOptions = [
                { entry: 'lib/utils/test/sample' },
                { progress: 'bar' },
                { sourcemap: 'eval' },
                { dev: false },
                { prod: true }
            ]
            const GroupHelperObj = new GroupHelper(GroupHelperOptions);
            const entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry)
            const { dir, base } = parse(entryPath);
            const entryOutput = dir.split(sep).concat(base);
            expect(entryOutput.join('/').includes(GroupHelperOptions[0].entry)).toBe(true)
            done();

        })
        it('should return correct path : sample/index.js', done => {

            const GroupHelperOptions = [
                { entry: 'lib/utils/test/sample/index.js' },
                { progress: 'bar' },
                { sourcemap: 'eval' },
                { dev: false },
                { prod: true }
            ]
            const GroupHelperObj = new GroupHelper(GroupHelperOptions);
            const entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry)
            const { dir, base } = parse(entryPath);
            const entryOutput = dir.split(sep).concat(base);
            expect(entryOutput.join('/').includes(GroupHelperOptions[0].entry)).toBe(true)
            done();

        })
        it('should return correct path : sample/index', done => {

            const GroupHelperOptions = [
                { entry: 'lib/utils/test/sample/index' },
                { progress: 'bar' },
                { sourcemap: 'eval' },
                { dev: false },
                { prod: true }
            ]
            const GroupHelperObj = new GroupHelper(GroupHelperOptions);
            const entryPath = GroupHelperObj.resolveFilePath(GroupHelperOptions[0].entry)
            const { dir, base } = parse(entryPath);
            const entryOutput = dir.split(sep).concat(base);
            expect(entryOutput.join('/').includes(GroupHelperOptions[0].entry)).toBe(true)
            done();

        })
    })

})
