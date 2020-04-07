import defineTest from '../../../utils/__tests__/defineTest';
import { join } from 'path';

const dirName: string = join(__dirname);

describe('extractTextPlugin', function () {
    {
        defineTest(dirName, 'extractTextPlugin');
    }
});
