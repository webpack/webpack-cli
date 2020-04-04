import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('loaders', function () {
    {
        defineTest(dirName, 'loaders', 'loaders-0');
        defineTest(dirName, 'loaders', 'loaders-1');
        defineTest(dirName, 'loaders', 'loaders-2');
        defineTest(dirName, 'loaders', 'loaders-3');
        defineTest(dirName, 'loaders', 'loaders-4');
        defineTest(dirName, 'loaders', 'loaders-5');
        defineTest(dirName, 'loaders', 'loaders-6');
        defineTest(dirName, 'loaders', 'loaders-7');
        defineTest(dirName, 'loaders', 'loaders-8');
    }
});
