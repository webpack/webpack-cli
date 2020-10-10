import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('noEmitOnErrorsPlugin', function () {
    {
        defineTest(dirName, 'noEmitOnErrorsPlugin', 'noEmitOnErrorsPlugin-0');
        defineTest(dirName, 'noEmitOnErrorsPlugin', 'noEmitOnErrorsPlugin-1');
        defineTest(dirName, 'noEmitOnErrorsPlugin', 'noEmitOnErrorsPlugin-2');
    }
});
