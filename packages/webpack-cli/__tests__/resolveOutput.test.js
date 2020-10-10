const { resolve } = require('path');
const resolveOutput = require('../lib/groups/resolveOutput');

describe('OutputGroup', function () {
    it('should handle the output option', () => {
        const result = resolveOutput({
            outputPath: './bundle',
        });
        expect(result.options.output.path).toEqual(resolve('bundle'));
    });
});
