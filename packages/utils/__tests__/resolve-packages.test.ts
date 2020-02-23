'use strict';

import path from 'path';

function mockPromise(value) {
    const isValueAPromise = (value || {}).then;
    const mockedPromise = {
        then(callback) {
            return mockPromise(callback(value));
        },
    };

    return isValueAPromise ? value : mockedPromise;
}
function spawnChild(pkg) {
    return pkg;
}

function getLoc(option) {
    const packageModule = [];
    option.filter(pkg => {
        mockPromise(spawnChild(pkg)).then(() => {
            try {
                const loc = path.join('..', '..', 'node_modules', pkg);
                packageModule.push(loc);
            } catch (err) {
                throw new Error("Package wasn't validated correctly.." + 'Submit an issue for ' + pkg + ' if this persists');
            }
        });
        return packageModule;
    });
    return packageModule;
}

describe('resolve-packages', () => {
    let moduleLoc;

    afterEach(() => {
        moduleLoc = null;
    });

    it('should resolve a location of a published module', () => {
        moduleLoc = getLoc(['webpack-scaffold-ylvis']);
        expect(moduleLoc).toEqual([path.normalize('../../node_modules/webpack-scaffold-ylvis')]);
    });

    it('should be empty if argument is blank', () => {
        // normally caught before getting resolved
        moduleLoc = getLoc([' ']);
        expect(moduleLoc).toEqual([path.normalize('../../node_modules/ ')]);
    });

    it('should resolve multiple locations of published modules', () => {
        /* we're testing multiple paths here. At Github this up for discussion, because if
         * we validate each package on each run, we can catch and build the questions in init gradually
         * while we get one filepath at the time. If not, this is a workaround.
         */
        moduleLoc = getLoc(['webpack-scaffold-ylvis', 'webpack-scaffold-noop']);
        expect(moduleLoc).toEqual([
            path.normalize('../../node_modules/webpack-scaffold-ylvis'),
            path.normalize('../../node_modules/webpack-scaffold-noop'),
        ]);
    });
});
