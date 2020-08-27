import {
    createArrowFunction,
    createAssetFilterFunction,
    createDynamicPromise,
    createRegularFunction,
    parseValue,
    CheckList,
    Confirm,
    createExternalFunction,
    createRequire,
    List,
    RawList,
    InputValidate,
    Input,
} from '../src';

describe('utils', () => {
    beforeEach(() => {
        this.mockSelf = {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            prompt: (arg) => {
                return arg[0];
            },
        };
    });
    describe('createArrowFunction', () => {
        it('should stringify an arrow function', () => {
            expect(createArrowFunction('app.js')).toMatchSnapshot();
        });
    });
    describe('createRegularFunction', () => {
        it('should stringify a regular function', () => {
            expect(createRegularFunction('app.js')).toMatchSnapshot();
        });
    });
    describe('createDynamicPromise', () => {
        it('should stringify an single value', () => {
            expect(createDynamicPromise('app.js')).toMatchSnapshot();
        });
        it('should stringify an array', () => {
            expect(createDynamicPromise(['app.js', 'index.js'])).toMatchSnapshot();
        });
    });
    describe('createAssetFilterFunction', () => {
        it('should stringify an assetFilterFunction', () => {
            expect(createAssetFilterFunction('js')).toMatchSnapshot();
        });
    });
    describe('parseValue', () => {
        it('should parse value', () => {
            expect(parseValue('\t')).toMatchSnapshot();
        });
        it('should parse value with raw value', () => {
            expect(parseValue('hell\u{6F}')).toMatchSnapshot();
        });
    });
    describe('createExternalFunction', () => {
        it('should stringify an ExternalFunction', () => {
            expect(createExternalFunction('js')).toMatchSnapshot();
        });
    });
    describe('createRequire', () => {
        it('should stringify a require statement', () => {
            expect(createRequire('webpack')).toMatchSnapshot();
        });
    });
    describe('Inquirer', () => {
        it('should emulate a prompt for List', () => {
            expect(List(this.mockSelf, 'entry', 'does it work?', ['Yes', 'Maybe'], 'Yes')).toEqual({
                choices: ['Yes', 'Maybe'],
                type: 'list',
                name: 'entry',
                message: 'does it work?',
                default: 'Yes',
            });
        });

        it('should make default value for a List', () => {
            expect(List(this.mockSelf, 'entry', 'does it work?', ['Yes', 'Maybe'], 'Yes', true)).toEqual({
                entry: 'Yes',
            });
        });
        it('should make a RawList object', () => {
            expect(RawList('output', 'does it work?', ['Yes', 'Maybe'])).toEqual({
                choices: ['Yes', 'Maybe'],
                message: 'does it work?',
                name: 'output',
                type: 'rawlist',
            });
        });
        it('should make a CheckList object', () => {
            expect(CheckList('context', 'does it work?', ['Yes', 'Maybe'])).toEqual({
                choices: ['Yes', 'Maybe'],
                message: 'does it work?',
                name: 'context',
                type: 'checkbox',
            });
        });
        it('should emulate a prompt for list input', () => {
            expect(Input(this.mockSelf, 'plugins', 'what is your plugin?', 'openJSF')).toEqual({
                type: 'input',
                name: 'plugins',
                message: 'what is your plugin?',
                default: 'openJSF',
            });
        });
        it('should return a default Input object value', () => {
            expect(Input(this.mockSelf, 'plugins', 'what is your plugin?', 'my-plugin', true)).toEqual({
                plugins: 'my-plugin',
            });
        });
        it('should emulate a prompt for confirm', () => {
            expect(Confirm(this.mockSelf, 'context', 'what is your context?')).toEqual({
                name: 'context',
                default: true,
                message: 'what is your context?',
                type: 'confirm',
            });
        });
        it('should make a Confirm object with yes as default', () => {
            expect(Confirm(this.mockSelf, 'context', 'what is your context?', true, true)).toEqual({
                context: true,
            });
        });
        it('should make an Input object with validation', () => {
            expect(InputValidate(this.mockSelf, 'plugins', 'what is your plugin?', () => true)).toMatchSnapshot();
        });
        it('should make an Input object with validation and default value', () => {
            expect(InputValidate(this.mockSelf, 'plugins', 'what is your plugin?', () => true, 'my-plugin')).toMatchSnapshot();
        });
        it('should return a default Input object with validation and default value', () => {
            expect(InputValidate(this.mockSelf, 'plugins', 'what is your plugin?', () => true, 'my-plugin', true)).toEqual({
                plugins: 'my-plugin',
            });
        });
    });
});
