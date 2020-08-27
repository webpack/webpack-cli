import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('outputPath', function () {
    {
        defineTest(dirName, 'outputPath', 'outputPath-0');
        defineTest(dirName, 'outputPath', 'outputPath-1');
        defineTest(dirName, 'outputPath', 'outputPath-2');
    }
});
