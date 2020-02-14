const GroupHelper = require('../packages/cli/lib/utils/GroupHelper');

describe('GroupHelper', function() {
    it('should return undefined', () => {
        const helper = new GroupHelper();

        expect(helper.arrayToObject()).toBeUndefined();
    });
});
