import fs from 'fs';
import { runLoaders } from 'loader-runner';
import { getFixtureResource, getFixture, getLoader } from './test-utils';

const loaders = getLoader();

describe('Example Loader Tests: Fixture: simple-file', () => {
	const fixtureName = 'simple-file';
	const resource = getFixture(fixtureName);

	test('loaded file should be different', async (done) => {
		const originalSource = fs.readFileSync(resource);
    runLoaders({ resource: getFixtureResource(fixtureName), loaders }, (_, result) => {
		  expect(result).not.toEqual(originalSource);
      done();
    })
	});

	test('loader prepends correct information', async (done) => {
		runLoaders({ resource: getFixtureResource(fixtureName), loaders }, (_, result) => {
      const resultMatcher = expect.arrayContaining([
        expect.stringContaining(' * Original Source From Loader'),
      ]);

      expect(result).toEqual(resultMatcher);
      expect(result).toMatchSnapshot();
      done();
    })
	});
});
