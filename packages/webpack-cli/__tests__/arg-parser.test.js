const warnMock = jest.fn();
const rawMock = jest.fn();
jest.mock('../lib/utils/logger', () => {
    return {
        warn: warnMock,
        raw: rawMock,
    };
});

const helpMock = jest.fn();
jest.mock('../lib/groups/runHelp', () => helpMock);
const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

const argParser = () => {};
const { flags } = require('../lib/utils/cli-flags');

const basicOptions = [
    {
        name: 'bool-flag',
        alias: 'b',
        usage: '--bool-flag',
        type: Boolean,
        description: 'boolean flag',
    },
    {
        name: 'num-flag',
        usage: '--num-flag <value>',
        type: Number,
        description: 'number flag',
    },
    {
        name: 'neg-flag',
        alias: 'n',
        usage: '--neg-flag',
        type: Boolean,
        negative: true,
        description: 'boolean flag',
    },
    {
        name: 'string-flag',
        alias: 's',
        usage: '--string-flag <value>',
        type: String,
        description: 'string flag',
    },
    {
        name: 'string-flag-with-default',
        usage: '--string-flag-with-default <value>',
        type: String,
        description: 'string flag',
        defaultValue: 'default-value',
    },
    {
        name: 'multi-type',
        alias: 'm',
        usage: '--multi-type | --multi-type <value>',
        type: [String, Boolean],
        negative: true,
        description: 'flag with multiple types',
    },
    {
        name: 'multi-type-different-order',
        usage: '--multi-type-different-order | --multi-type-different-order <value>',
        // duplicates and a different ordering should be handled correctly
        type: [Boolean, String, Boolean],
        description: 'flag with multiple types in different order',
    },
    {
        name: 'multi-type-empty',
        usage: '--multi-type-empty',
        // should default to Boolean type
        type: [],
        description: 'flag with empty multi type array',
    },
    {
        name: 'multi-type-number',
        usage: '--multi-type-number',
        // should use only Number type (the first in the array),
        // because Number and Boolean together are not supported
        type: [Number, Boolean],
        description: 'flag with number multi type',
    },
    {
        name: 'custom-type-flag',
        usage: '--custom-type-flag <value>',
        type: (val) => {
            return val.split(',');
        },
        description: 'custom type flag',
    },
    {
        name: 'multi-flag',
        usage: '--multi-flag <value>',
        type: String,
        multiple: true,
        description: 'multi flag',
    },
    {
        name: 'processor-flag',
        usage: '--processor-flag',
        type: Boolean,
        description: 'flag with processor',
        processor(opts) {
            opts.processed = opts.processorFlag;
            delete opts.processorFlag;
        },
    },
    {
        name: 'env',
        usage: '--env',
        type: String,
        multipleType: true,
        description: 'Environment passed to the configuration when it is a function',
    },
];

const helpAndVersionOptions = basicOptions.slice(0);
helpAndVersionOptions.push(
    {
        name: 'help',
        usage: '--help',
        type: Boolean,
        description: 'help',
    },
    {
        name: 'version',
        alias: 'v',
        usage: '--version',
        type: Boolean,
        description: 'version',
    },
);

describe.skip('arg-parser', () => {
    beforeEach(() => {
        warnMock.mockClear();
        processExitSpy.mockClear();
        consoleErrorSpy.mockClear();
    });

    it('parses no flags', () => {
        const res = argParser(basicOptions, [], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses basic flags', () => {
        const res = argParser(basicOptions, ['--bool-flag', '--string-flag', 'val', '--num-flag', '100'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            boolFlag: true,
            numFlag: 100,
            stringFlag: 'val',
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses number flags', () => {
        const res = argParser(basicOptions, ['--num-flag', '100'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            numFlag: 100,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses number flags with = sign', () => {
        const res = argParser(basicOptions, ['--num-flag=10'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            numFlag: 10,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('should not parse negated boolean flags which are not specified', () => {
        const res = argParser(basicOptions, ['--no-bool-flag'], true);
        expect(res.unknownArgs.includes('--no-bool-flag')).toBeTruthy();
    });

    it('parses boolean flag alias', () => {
        const res = argParser(basicOptions, ['-b'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            boolFlag: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses string flag alias', () => {
        const res = argParser(basicOptions, ['-s', 'string-value'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            stringFlag: 'string-value',
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses multi type flag as Boolean', () => {
        const res = argParser(basicOptions, ['--multi-type'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiType: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses multi type flag as String', () => {
        const res = argParser(basicOptions, ['--multi-type', 'value'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiType: 'value',
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses multi type flag alias as Boolean', () => {
        const res = argParser(basicOptions, ['-m'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiType: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses multi type flag alias as String', () => {
        const res = argParser(basicOptions, ['-m', 'value'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiType: 'value',
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses negated multi type flag as Boolean', () => {
        const res = argParser(basicOptions, ['--no-multi-type'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiType: false,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses multi type flag with different ordering as Boolean', () => {
        const res = argParser(basicOptions, ['--multi-type-different-order'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiTypeDifferentOrder: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses multi type flag with different ordering as String', () => {
        const res = argParser(basicOptions, ['--multi-type-different-order', 'value'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiTypeDifferentOrder: 'value',
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses empty multi type flag array as Boolean', () => {
        const res = argParser(basicOptions, ['--multi-type-empty'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiTypeEmpty: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses multi type flag (Number, Boolean) as Number', () => {
        const res = argParser(basicOptions, ['--multi-type-number', '1.1'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiTypeNumber: 1.1,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parsing multi type flag (Number, Boolean) as Boolean fails', () => {
        // this should fail because a multi type of Number and Boolean is
        // not supported
        argParser(basicOptions, ['--multi-type-number'], true);
        expect(warnMock.mock.calls.length).toEqual(0);

        // by default, commander handles the error with a process.exit(1)
        // along with an error message
        expect(processExitSpy.mock.calls.length).toEqual(1);
        expect(processExitSpy.mock.calls[0]).toEqual([1]);

        expect(consoleErrorSpy.mock.calls.length).toEqual(1);
        expect(consoleErrorSpy.mock.calls[0][0]).toContain("option '--multi-type-number <value>' argument missing");
    });

    it('warns on usage of both flag alias and same negated flag, setting it to true', () => {
        const res = argParser(basicOptions, ['--no-neg-flag', '-n'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            negFlag: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(1);
        expect(warnMock.mock.calls[0][0]).toContain('You provided both -n and --no-neg-flag');
    });

    it('parses string flag using equals sign', () => {
        const res = argParser(basicOptions, ['--string-flag=val'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            stringFlag: 'val',
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('handles multiple same args', () => {
        const res = argParser(basicOptions, ['--multi-flag', 'a.js', '--multi-flag', 'b.js'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            multiFlag: ['a.js', 'b.js'],
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('handles additional node args from argv', () => {
        const res = argParser(basicOptions, ['node', 'index.js', '--bool-flag', '--string-flag', 'val'], false);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            boolFlag: true,
            stringFlag: 'val',
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('handles unknown args', () => {
        const res = argParser(basicOptions, ['--unknown-arg', '-b', 'no-leading-dashes'], true);
        expect(res.unknownArgs).toEqual(['--unknown-arg', 'no-leading-dashes']);
        expect(res.opts).toEqual({
            boolFlag: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('handles custom type args', () => {
        const res = argParser(basicOptions, ['--custom-type-flag', 'val1,val2,val3'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            customTypeFlag: ['val1', 'val2', 'val3'],
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('calls help callback on --help', () => {
        argParser(helpAndVersionOptions, ['--help'], true, '');
        expect(helpMock.mock.calls.length).toEqual(1);
        expect(helpMock.mock.calls[0][0]).toEqual(['--help']);
    });

    it('parses webpack args', () => {
        const res = argParser(flags, ['--entry', 'test.js', '--hot', '-o', './dist/', '--stats'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts.entry).toEqual(['test.js']);
        expect(res.opts.hot).toBeTruthy();
        expect(res.opts.outputPath).toEqual('./dist/');
        expect(res.opts.stats).toEqual(true);
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses --neg-flag', () => {
        const res = argParser(basicOptions, ['--neg-flag'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            negFlag: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses --no-neg-flag', () => {
        const res = argParser(basicOptions, ['--no-neg-flag'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            negFlag: false,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('warns on usage of both --neg and --no-neg flag, setting it to false', () => {
        const res = argParser(basicOptions, ['--neg-flag', '--no-neg-flag'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            negFlag: false,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(1);
        expect(warnMock.mock.calls[0][0]).toContain('You provided both --neg-flag and --no-neg-flag');
    });

    it('warns on usage of both flag and same negated flag, setting it to true', () => {
        const res = argParser(basicOptions, ['--no-neg-flag', '--neg-flag'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            negFlag: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(1);
        expect(warnMock.mock.calls[0][0]).toContain('You provided both --neg-flag and --no-neg-flag');
    });

    it('handles unknown flag', () => {
        const res = argParser(basicOptions, ['--unknown-flag'], true);
        expect(res.unknownArgs).toEqual(['--unknown-flag']);
        expect(res.opts).toEqual({
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses multiType flag', () => {
        const res = argParser(basicOptions, ['--env', 'production', '--env', 'platform=staging'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts.env).toEqual({
            platform: 'staging',
            production: true,
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses nested multiType flag', () => {
        const res = argParser(basicOptions, ['--env', 'a.b=d', '--env', 'a.b.c=d'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts.env).toEqual({
            a: {
                b: {
                    c: 'd',
                },
            },
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('parses nested multiType flag with diff keys', () => {
        const res = argParser(basicOptions, ['--env', 'a.b=c', '--env', 'd.e.f=g'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts.env).toEqual({
            a: {
                b: 'c',
            },
            d: {
                e: {
                    f: 'g',
                },
            },
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });
});
