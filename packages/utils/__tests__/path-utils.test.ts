import * as pathUtils from '../src/path-utils';

describe('local path test', () => {
    it('should check the local path', () => {
        const pathStatus = pathUtils.isLocalPath('./');
        expect(pathStatus).toBe(true);
    });
    it('should check the wrong local path', () => {
        const pathStatus = pathUtils.isLocalPath('xyz/');
        expect(pathStatus).toBe(false);
    });
});
