const resolveStats = require('../lib/groups/resolveStats');

describe('StatsGroup', function () {
    it('should assign json correctly', () => {
        const result = resolveStats({
            json: true,
        });
        expect(result.options.stats).toBeFalsy();
        expect(result.outputOptions.json).toBeTruthy();
    });

    it('should assign stats correctly', () => {
        const result = resolveStats({
            stats: 'warning',
        });
        expect(result.options.stats).toEqual('warning');
        expect(result.outputOptions.json).toBeFalsy();
    });
});
