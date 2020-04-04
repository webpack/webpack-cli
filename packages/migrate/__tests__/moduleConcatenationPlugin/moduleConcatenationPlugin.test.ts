import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('moduleConcatenationPlugin', function () {
    {
        defineTest(dirName, 'moduleConcatenationPlugin', 'moduleConcatenationPlugin-0');
        defineTest(dirName, 'moduleConcatenationPlugin', 'moduleConcatenationPlugin-1');
        defineTest(dirName, 'moduleConcatenationPlugin', 'moduleConcatenationPlugin-2');
    }
});
