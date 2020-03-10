const StatsGroup = require('../lib/groups/StatsGroup');

describe('StatsGroup', function() {
    {
        StatsGroup.validOptions().map(option => {
            it(`should handle ${option} option`, () => {
                const statsGroup = new StatsGroup([
                    {
                        stats: option,
                    },
                ]);

                const result = statsGroup.run();
                expect(result.options.stats).toEqual(option);
            });
        });
    }
});
