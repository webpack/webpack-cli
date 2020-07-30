const StatsGroup = require('../lib/groups/StatsGroup');

describe('StatsGroup', function () {
    it('should handle json', () => {
        const group = new StatsGroup([
            {
                json: true,
            },
        ]);

        const result = group.run();
        expect(result.options.stats).toBeFalsy();
        expect(result.outputOptions.json).toBeTruthy();
    });
});
