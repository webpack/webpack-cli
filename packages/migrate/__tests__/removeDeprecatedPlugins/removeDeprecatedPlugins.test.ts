import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('remove deprecated plugin', function () {
    {
        defineTest(dirName, 'removeDeprecatedPlugins', 'removeDeprecatedPlugins-0');
        defineTest(dirName, 'removeDeprecatedPlugins', 'removeDeprecatedPlugins-1');
        defineTest(dirName, 'removeDeprecatedPlugins', 'removeDeprecatedPlugins-2');
        defineTest(dirName, 'removeDeprecatedPlugins', 'removeDeprecatedPlugins-3');
        defineTest(dirName, 'removeDeprecatedPlugins', 'removeDeprecatedPlugins-4');
    }
});
