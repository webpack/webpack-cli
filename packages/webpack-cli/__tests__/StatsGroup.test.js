const StatsGroup = require('../lib/groups/StatsGroup');

describe('StatsGroup', function () {
    {
        StatsGroup.validOptions().validArrayString.map((option) => {
            it(`should handle ${option} option`, () => {
                const statsGroup = new StatsGroup([{ stats: `${option}` }]);
                const result = statsGroup.run();
                expect(result.options.stats).toEqual(option);
            });
        });
        StatsGroup.validOptions().validArrayObject.map((option) => {
            let stats = option.stats ? option.stats : null;
            it(`should handle verbose true with stats ${stats} option`, () => {
                const statsGroup = new StatsGroup(option);
                const result = statsGroup.run();
                expect(result.options.stats).toEqual('verbose');
            });
        });
    }
});
