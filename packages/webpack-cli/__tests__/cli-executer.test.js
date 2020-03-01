jest.mock('../lib/runner');
jest.mock('enquirer');

const runner = require('../lib/runner');
runner.mockImplementation(() => {});

describe('CLI Executer', () => {
    let cliExecuter = null;
    let multiCalls = 0;
    let multiChoices = null;
    let multiMapper = null;

    let inputCalls = 0;
    const inputConstructorObjs = [];

    beforeAll(() => {
        let inputRunCount = 0;

        const enquirer = require('enquirer');
        enquirer.MultiSelect = class MultiSelect {
            constructor(obj) {
                multiCalls++;
                multiChoices = obj.choices;
                multiMapper = obj.result;
            }

            run() {
                return ['--config', '--entry', '--progress'];
            }
        };
        enquirer.Input = class Input {
            constructor(obj) {
                this.mapper = obj.result;
                inputCalls++;
                inputConstructorObjs.push(obj);
            }

            run(obj) {
                inputRunCount++;
                return this.mapper(`test${inputRunCount}`);
            }
        };

        cliExecuter = require('../lib/utils/cli-executer');
    });

    it('runs enquirer options', async () => {
        await cliExecuter();
        expect(runner.mock.calls).toMatchSnapshot();
        expect(multiCalls).toEqual(1);
        expect(multiChoices).toMatchSnapshot();
        expect(typeof multiMapper).toEqual('function');
        expect(multiMapper(['--test1: test flag', '--test2: test flag 2'])).toEqual(['--test1', '--test2']);

        expect(inputCalls).toEqual(2);
        expect(inputConstructorObjs).toMatchSnapshot();
    });
});
