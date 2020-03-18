const AdvancedGroup = require('../lib/groups/AdvancedGroup');

describe('GroupHelper', function() {
    it('should load the hot advanced config', () => {
        const group = new AdvancedGroup([
            {
                hot: true,
            },
        ]);

        const result = group.run();
        expect(result.options.plugins).toBeTruthy();
    });
});
