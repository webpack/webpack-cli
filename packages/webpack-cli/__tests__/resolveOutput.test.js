const resolveOutput = require('../lib/groups/resolveOutput');

describe('OutputGroup', function () {
    it('should handle the output option', () => {
        const result = resolveOutput({
            output: './bundle.js',
        });
        expect(result.options.output.filename).toEqual('bundle.js');
    });
});
