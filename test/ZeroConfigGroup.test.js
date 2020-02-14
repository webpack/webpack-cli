const ZeroConfigGroup = require('../packages/cli/lib/groups/ZeroConfigGroup');

describe('GroupHelper', function() {
    it('should  load the dev zero config', () => {
        const group = new ZeroConfigGroup([
            {
                dev: true,
            },
        ]);

        const result = group.run();
        expect(result.options.mode).toEqual('development');
    });
    it('should load the prod zero config', () => {
        const group = new ZeroConfigGroup([
            [
                {
                    prod: true,
                },
            ],
        ]);

        const result = group.run();
        expect(result.options.mode).toEqual('production');
    });
});
