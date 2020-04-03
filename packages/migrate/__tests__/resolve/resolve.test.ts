import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('resolve', function () {
    {
        defineTest(dirName, 'resolve');
    }
});
