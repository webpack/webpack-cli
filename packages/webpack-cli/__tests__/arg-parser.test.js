const warnMock = jest.fn();
jest.mock('../lib/utils/logger', () => {
    return {
        warn: warnMock,
    };
});
jest.spyOn(process, 'exit').mockImplementation(() => {});

const argParser = require('../lib/utils/arg-parser');
const { core } = require('../lib/utils/cli-flags');

const basicOptions = [
    {
        name: 'bool-flag',
        alias: 'b',
        usage: '--bool-flag',
        type: Boolean,
        description: 'boolean flag',
    },
    {
        name: 'specific-bool',
        alias: 's',
        usage: '--specific-bool',
        type: Boolean,
        description: 'boolean flag',
    },
    {
        name: 'no-specific-bool',
        usage: '--no-specific-bool',
        type: Boolean,
        description: 'boolean flag',
    },
    {
        name: 'string-flag',
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

describe('arg-parser', () => {
    beforeEach(() => {
        warnMock.mockClear();
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
        const res = argParser(basicOptions, ['--bool-flag', '--string-flag', 'val'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            boolFlag: true,
            stringFlag: 'val',
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

    it('parses specified negated boolean flag', () => {
        const res = argParser(basicOptions, ['--no-specific-bool'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            specificBool: false,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(0);
    });

    it('warns on usage of both flag and same negated flag, setting it to false', () => {
        const res = argParser(basicOptions, ['--specific-bool', '--no-specific-bool'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            specificBool: false,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(1);
        expect(warnMock.mock.calls[0][0]).toContain('You provided both --specific-bool and --no-specific-bool');
    });

    it('warns on usage of both flag and same negated flag, setting it to true', () => {
        const res = argParser(basicOptions, ['--no-specific-bool', '--specific-bool'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            specificBool: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(1);
        expect(warnMock.mock.calls[0][0]).toContain('You provided both --specific-bool and --no-specific-bool');
    });

    it('warns on usage of both flag alias and same negated flag, setting it to true', () => {
        const res = argParser(basicOptions, ['--no-specific-bool', '-s'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts).toEqual({
            specificBool: true,
            stringFlagWithDefault: 'default-value',
        });
        expect(warnMock.mock.calls.length).toEqual(1);
        expect(warnMock.mock.calls[0][0]).toContain('You provided both -s and --no-specific-bool');
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
        const helpCb = jest.fn();
        argParser(helpAndVersionOptions, ['--help'], true, '', helpCb);
        expect(helpCb.mock.calls.length).toEqual(1);
        expect(helpCb.mock.calls[0][0]).toEqual(['--help']);
    });

    it('calls version callback on --version', () => {
        const versionCb = jest.fn();
        argParser(helpAndVersionOptions, ['--version'], true, '', () => {}, versionCb);
        expect(versionCb.mock.calls.length).toEqual(1);
    });

    it('parses webpack args', () => {
        const res = argParser(core, ['--entry', 'test.js', '--hot', '-o', './dist/'], true);
        expect(res.unknownArgs.length).toEqual(0);
        expect(res.opts.entry).toEqual(['test.js']);
        expect(res.opts.hot).toBeTruthy();
        expect(res.opts.output).toEqual('./dist/');
        expect(warnMock.mock.calls.length).toEqual(0);
    });
});
