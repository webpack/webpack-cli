import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('namedModulesPlugin', function () {
    {
        defineTest(dirName, 'namedModulesPlugin', 'namedModulesPlugin-0');
        defineTest(dirName, 'namedModulesPlugin', 'namedModulesPlugin-1');
        defineTest(dirName, 'namedModulesPlugin', 'namedModulesPlugin-2');
    }
});
