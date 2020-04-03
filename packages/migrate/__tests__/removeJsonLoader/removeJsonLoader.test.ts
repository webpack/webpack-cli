import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('removeJsonLoader', function () {
    {
        defineTest(dirName, 'removeJsonLoader', 'removeJsonLoader-0');
        defineTest(dirName, 'removeJsonLoader', 'removeJsonLoader-1');
        defineTest(dirName, 'removeJsonLoader', 'removeJsonLoader-2');
        defineTest(dirName, 'removeJsonLoader', 'removeJsonLoader-3');
    }
});
