'use strict';
import { npmExists } from '../src/npm-exists';

describe('npm-exists', () => {
    it('should successfully existence of a published module', () => {
        npmExists('webpack-scaffold-demo').then((status) => {
            expect(status).toBe(true);
        });
    });

    it('should return false for the existence of a fake module', () => {
        npmExists('webpack-scaffold-noop').then((status) => {
            expect(status).toBe(false);
        });
    });
});
