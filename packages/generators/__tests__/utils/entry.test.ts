jest.setMock('@webpack-cli/webpack-scaffold', {
    Input: jest.fn(),
    InputValidate: jest.fn(),
});

import { Input, InputValidate } from '@webpack-cli/webpack-scaffold';
import entry from '../../lib/utils/entry';

describe('entry', () => {
    const InputMock = Input as jest.Mock;
    const InputValidateMock = InputValidate as jest.Mock;

    it('handles single entry empty string', async () => {
        InputMock.mockReturnValue({
            singularEntry: '',
        });
        expect(await entry(null, false, null)).toEqual('');
    });

    it('handles single entry path', async () => {
        InputMock.mockReturnValue({
            singularEntry: 'path/to/index',
        });
        expect(await entry(null, false, null)).toEqual("'./path/to/index.js'");
    });

    it('handles single entry path with js extension', async () => {
        InputMock.mockReturnValue({
            singularEntry: 'path/to/index.js',
        });
        expect(await entry(null, false, null)).toEqual("'./path/to/index.js'");
    });

    it('handles single entry relative path', async () => {
        InputMock.mockReturnValue({
            singularEntry: './path/to/index',
        });
        expect(await entry(null, false, null)).toEqual("'./path/to/index.js'");
    });

    it('handles multiple entry paths', async () => {
        let calls = 0;
        InputValidateMock.mockImplementation(() => {
            calls++;
            if (calls === 1) {
                return {
                    multipleEntries: 'test1, test2',
                };
            } else if (calls === 2) {
                return {
                    test1: 'src/test1',
                };
            } else {
                return {
                    test2: 'src/test2',
                };
            }
        });
        expect(await entry(null, true, null)).toEqual({
            test1: "'./src/test1.js'",
            test2: "'./src/test2.js'",
        });
    });

    it('handles multiple entry paths with varying formats', async () => {
        let calls = 0;
        InputValidateMock.mockImplementation(() => {
            calls++;
            if (calls === 1) {
                return {
                    multipleEntries: ' test1 , test2 ',
                };
            } else if (calls === 2) {
                return {
                    test1: './path/to/test1',
                };
            } else {
                return {
                    test2: 'src/test2.js',
                };
            }
        });
        expect(await entry(null, true, null)).toEqual({
            test1: "'./path/to/test1.js'",
            test2: "'./src/test2.js'",
        });
    });
});
