const StatsGroup = require('../lib/groups/StatsGroup');

describe('StatsGroup', function () {
    {
        StatsGroup.validOptions().map((option) => {
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

    it('should handle verbose', () => {
        const group = new StatsGroup([
            {
                verbose: true,
            },
        ]);

        const result = group.run();
        expect(result.options.stats).toEqual('verbose');
    });

    it('should handle json', () => {
        const group = new StatsGroup([
            {
                json: true,
            },
        ]);

        const result = group.run();
        expect(result.outputOptions.json).toBeTruthy();
    });
});
