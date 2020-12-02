import { Confirm, List, InputValidate, Input } from '../../src/utils/scaffold-utils';

describe('utils', () => {
    beforeEach(() => {
        this.mockSelf = {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            prompt: (arg) => {
                return arg[0];
            },
        };
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
