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

    it('runs enquirer options then runs webpack', async () => {
        await cliExecuter();

        // ensure that the webpack runner is called
        expect(runner.mock.calls.length).toEqual(1);
        expect(runner.mock.calls[0]).toEqual([[], ['--config', 'test1', '--entry', 'test2', '--progress']]);

        // check that webpack options are actually being displayed that
        // the user can select from
        expect(multiCalls).toEqual(1);
        expect(multiChoices instanceof Array).toBeTruthy();
        expect(multiChoices.length > 0).toBeTruthy();
        expect(multiChoices[0]).toMatch(/\-\-entry/);

        // ensure flag names are parsed out correctly
        expect(typeof multiMapper).toEqual('function');
        expect(multiMapper(['--test1: test flag', '--test2: test flag 2'])).toEqual(['--test1', '--test2']);

        // check that the user is then prompted to set values to
        // some flags
        expect(inputCalls).toEqual(2);
        expect(inputConstructorObjs.length).toEqual(2);
        expect(inputConstructorObjs[0].message).toEqual('Enter value of the --config flag');
        expect(inputConstructorObjs[1].message).toEqual('Enter value of the --entry flag');
    });
});
