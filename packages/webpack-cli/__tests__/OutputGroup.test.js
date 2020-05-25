const OutputGroup = require('../lib/groups/OutputGroup');

describe('OutputGroup', function () {
    it('should handle the output option', () => {
        const group = new OutputGroup([
            {
                output: './bundle.js',
            },
        ]);

        const result = group.run();
        expect(result.options.output.filename).toEqual('bundle.js');
    });
});
