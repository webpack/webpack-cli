import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);
describe('loaderOptionsPlugin', function () {
    {
        defineTest(dirName, 'loaderOptionsPlugin', 'loaderOptionsPlugin-0');
        defineTest(dirName, 'loaderOptionsPlugin', 'loaderOptionsPlugin-1');
        defineTest(dirName, 'loaderOptionsPlugin', 'loaderOptionsPlugin-2');
        defineTest(dirName, 'loaderOptionsPlugin', 'loaderOptionsPlugin-3');
    }
});
