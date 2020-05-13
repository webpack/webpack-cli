import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('banner plugin', function () {
    {
        defineTest(dirName, 'bannerPlugin', 'bannerPlugin-0');
        defineTest(dirName, 'bannerPlugin', 'bannerPlugin-1');
        defineTest(dirName, 'bannerPlugin', 'bannerPlugin-2');
    }
});
