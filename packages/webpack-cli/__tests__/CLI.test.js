const CLI = require('../lib/webpack-cli');

describe('CLI API', () => {
    let cli;

    beforeEach(() => {
        cli = new CLI();
    });

    describe('makeCommand', () => {
        it('should make command', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand({ name: 'command' }, [], (program) => {
                expect(program.opts()).toEqual({});

                done();
            });

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with Boolean option by default', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean',
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ boolean: true });

                    done();
                },
            );

            command.parseAsync(['--boolean'], { from: 'user' });
        });

        it('should make command with Boolean option', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean',
                        type: Boolean,
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ boolean: true });

                    done();
                },
            );

            command.parseAsync(['--boolean'], { from: 'user' });
        });

        it('should make command with Boolean option and negative value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean',
                        type: Boolean,
                        description: 'description',
                        negative: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ boolean: false });

                    done();
                },
            );

            command.parseAsync(['--no-boolean'], { from: 'user' });
        });

        it('should make command with Boolean option and negative value #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean',
                        type: Boolean,
                        description: 'description',
                        negative: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ boolean: false });

                    done();
                },
            );

            command.parseAsync(['--boolean', '--no-boolean'], { from: 'user' });
        });

        it('should make command with Boolean option and negative value #3', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean',
                        type: Boolean,
                        description: 'description',
                        negative: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ boolean: true });

                    done();
                },
            );

            command.parseAsync(['--no-boolean', '--boolean'], { from: 'user' });
        });

        it('should make command with Boolean option with default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean',
                        type: Boolean,
                        description: 'description',
                        defaultValue: false,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ boolean: false });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with String option', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        type: String,
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: 'bar' });

                    done();
                },
            );

            command.parseAsync(['--string', 'bar'], { from: 'user' });
        });

        it('should make command with String option with alias', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        alias: 's',
                        type: String,
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: 'foo' });

                    done();
                },
            );

            command.parseAsync(['-s', 'foo'], { from: 'user' });
        });

        it('should make command with String option with default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        type: String,
                        description: 'description',
                        defaultValue: 'default-value',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: 'default-value' });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with String option with default value #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        type: String,
                        description: 'description',
                        defaultValue: 'default-value',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: 'foo' });

                    done();
                },
            );

            command.parseAsync(['--string', 'foo'], { from: 'user' });
        });

        it('should make command with String option using "=" syntax', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        type: String,
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: 'bar' });

                    done();
                },
            );

            command.parseAsync(['--string=bar'], { from: 'user' });
        });

        it('should make command with multiple String option', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        multiple: true,
                        type: String,
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: ['foo', 'bar'] });

                    done();
                },
            );

            command.parseAsync(['--string', 'foo', 'bar'], { from: 'user' });
        });

        it('should make command with multiple String option with default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        multiple: true,
                        type: String,
                        description: 'description',
                        defaultValue: 'string',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: 'string' });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with multiple String option with default value #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        multiple: true,
                        type: String,
                        description: 'description',
                        defaultValue: 'string',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: ['foo', 'bar'] });

                    done();
                },
            );

            command.parseAsync(['--string', 'foo', '--string', 'bar'], { from: 'user' });
        });

        it('should make command with multiple String option #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'string',
                        multiple: true,
                        type: String,
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ string: ['foo', 'bar'] });

                    done();
                },
            );

            command.parseAsync(['--string', 'foo', '--string', 'bar'], { from: 'user' });
        });

        it('should make command with Number option', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'number',
                        type: Number,
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ number: 12 });

                    done();
                },
            );

            command.parseAsync(['--number', '12'], { from: 'user' });
        });

        it('should make command with Number option with default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'number',
                        type: Number,
                        description: 'description',
                        defaultValue: 20,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ number: 20 });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with multiple Number option', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'number',
                        multiple: true,
                        type: Number,
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ number: [1, 2] });

                    done();
                },
            );

            command.parseAsync(['--number', '1', '--number', '2'], { from: 'user' });
        });

        it('should make command with multiple Number option and default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'number',
                        multiple: true,
                        type: Number,
                        description: 'description',
                        defaultValue: 50,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ number: [1, 2] });

                    done();
                },
            );

            command.parseAsync(['--number', '1', '--number', '2'], { from: 'user' });
        });

        it('should make command with multiple Number option and default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'number',
                        multiple: true,
                        type: Number,
                        description: 'description',
                        defaultValue: 50,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ number: 50 });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with custom function type', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'custom',
                        type: () => {
                            return 'function';
                        },
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ custom: 'function' });

                    done();
                },
            );

            command.parseAsync(['--custom', 'value'], { from: 'user' });
        });

        it('should make command with custom function type and default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'custom',
                        type: () => {
                            return 'function';
                        },
                        description: 'description',
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ custom: 'default' });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with multiple custom function type', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'custom',
                        type: (value, previous = []) => {
                            return previous.concat([value]);
                        },
                        description: 'description',
                        multiple: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ custom: ['value', 'other'] });

                    done();
                },
            );

            command.parseAsync(['--custom', 'value', '--custom', 'other'], { from: 'user' });
        });

        it('should make command with multiple custom function type and default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'custom',
                        type: (value, previous = []) => {
                            return previous.concat([value]);
                        },
                        description: 'description',
                        multiple: true,
                        defaultValue: 50,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ custom: 50 });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with multiple custom function type and default value #2', async (done) => {
            cli.program.commands = [];

            let skipDefault = true;

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'custom',
                        type: (value, previous = []) => {
                            if (skipDefault) {
                                previous = [];
                                skipDefault = false;
                            }

                            return [].concat(previous).concat([value]);
                        },
                        description: 'description',
                        multiple: true,
                        defaultValue: 50,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ custom: ['foo'] });

                    done();
                },
            );

            command.parseAsync(['--custom', 'foo'], { from: 'user' });
        });

        it('should make command with Boolean and String option', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-string',
                        type: [Boolean, String],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndString: true });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-string'], { from: 'user' });
        });

        it('should make command with Boolean and String option #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-string',
                        type: [Boolean, String],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndString: 'value' });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-string', 'value'], { from: 'user' });
        });

        it('should make command with multiple Boolean and String option', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-string',
                        type: [Boolean, String],
                        description: 'description',
                        multiple: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndString: true });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-string'], { from: 'user' });
        });

        it('should make command with multiple Boolean and String option #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-string',
                        type: [Boolean, String],
                        description: 'description',
                        multiple: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndString: ['bar', 'baz'] });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-string', 'bar', '--boolean-and-string', 'baz'], { from: 'user' });
        });

        it('should make command with Boolean and String option and negative', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-string',
                        type: [Boolean, String],
                        description: 'description',
                        negative: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndString: true });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-string'], { from: 'user' });
        });

        it('should make command with Boolean and String option and negative #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-string',
                        type: [Boolean, String],
                        description: 'description',
                        negative: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndString: 'foo' });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-string', 'foo'], { from: 'user' });
        });

        it('should make command with Boolean and String option and negative #3', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-string',
                        type: [Boolean, String],
                        description: 'description',
                        negative: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndString: false });

                    done();
                },
            );

            command.parseAsync(['--no-boolean-and-string'], { from: 'user' });
        });

        it('should make command with Boolean and Number option', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number',
                        type: [Boolean, Number],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumber: true });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number'], { from: 'user' });
        });

        it('should make command with Boolean and Number option #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number',
                        type: [Boolean, Number],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumber: 12 });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number', '12'], { from: 'user' });
        });

        it('should make command with array Boolean type', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean',
                        type: [Boolean],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ boolean: true });

                    done();
                },
            );

            command.parseAsync(['--boolean'], { from: 'user' });
        });

        it('should make command with Boolean and Number and String type', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: true });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string'], { from: 'user' });
        });

        it('should make command with Boolean and Number and String type #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: 12 });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', '12'], { from: 'user' });
        });

        it('should make command with Boolean and Number and String type #3', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: 'bar' });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', 'bar'], { from: 'user' });
        });

        it('should make command with Boolean and Number and String type and default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: 'default' });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with Boolean and Number and String type and default value #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: 'foo' });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', 'foo'], { from: 'user' });
        });

        it('should make command with Boolean and Number and String type and default value #3', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: 12 });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', '12'], { from: 'user' });
        });

        it('should make command with Boolean and Number and String type and default value #4', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: 'default' });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string'], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String type', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: true });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string'], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String type #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: ['foo'] });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', 'foo'], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String type #3', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: [12] });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', '12'], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String type #4', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: ['foo', 'bar'] });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', 'foo', '--boolean-and-number-and-string', 'bar'], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String type #5', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: ['foo', 12] });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', 'foo', '--boolean-and-number-and-string', '12'], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String and default value', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: 'default' });

                    done();
                },
            );

            command.parseAsync([], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String and default value #2', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: ['foo'] });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', 'foo'], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String and default value #3', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: [12] });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', '12'], { from: 'user' });
        });

        it('should make command with multiple Boolean and Number and String and default value #4', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'boolean-and-number-and-string',
                        type: [Boolean, Number, String],
                        description: 'description',
                        multiple: true,
                        defaultValue: 'default',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ booleanAndNumberAndString: ['foo', 12] });

                    done();
                },
            );

            command.parseAsync(['--boolean-and-number-and-string', 'foo', '--boolean-and-number-and-string', '12'], { from: 'user' });
        });

        it('should make command with array of unknown types', async (done) => {
            cli.program.commands = [];

            const command = await cli.makeCommand(
                {
                    name: 'command',
                },
                [
                    {
                        name: 'unknown',
                        type: [Boolean, Symbol],
                        description: 'description',
                    },
                ],
                (program) => {
                    expect(program.opts()).toEqual({ unknown: 'foo' });

                    done();
                },
            );

            command.parseAsync(['--unknown', 'foo'], { from: 'user' });
        });
    });
});
