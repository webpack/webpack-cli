// eslint-disable-next-line node/no-unpublished-import
import { findProjectRoot } from '../../../src/path-utils';
import { join } from 'path';

beforeAll(() => {
    // This sets the project root as the root dir, needed since some tests change process cwd.
    process.chdir(join(__dirname, '../../../../../'));
});

describe('findProjectRoot function', () => {
    it('works correctly', () => {
        /* when no directory is passed, it takes the current process working directory as starting point
         which contains package.json thus it should be the project root */
        const projectRoot = findProjectRoot();
        expect(projectRoot).toEqual(process.cwd());
    });

    it('works correctly with a non-default dir', () => {
        /* when passing a custom directory, it's used as the starting point and so it should yield the path
        nearest package.json from the given directory */
        const projectRoot = findProjectRoot(__dirname);
        expect(projectRoot).toEqual(join(__dirname, '..'));
    });
});
