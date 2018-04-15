import fs from 'fs';
import Promise from 'bluebird';
import { runLoaders } from 'loader-runner';
import { getFixtureResource, getFixture, getLoader } from './test-utils';

const runLoadersPromise = Promise.promisify(runLoaders);
const readFilePromise = Promise.promisify(fs.readFile, { context: fs });


const loaders = getLoader();

describe('Example Loader Tests: Fixture: simple-file', () => {
	const fixtureName = 'simple-file';
	const resource = getFixture(fixtureName);

	test('loaded file should be different', async () => {
		const originalSource = await readFilePromise(resource);
		const { result } = await runLoadersPromise({ resource: getFixtureResource(fixtureName), loaders });

		expect(result).not.toEqual(originalSource);
	});

	test('loader prepends correct information', async () => {
		const { result } = await runLoadersPromise({ resource: getFixtureResource(fixtureName), loaders });
		const resultMatcher = expect.arrayContaining([
			expect.stringContaining(' * Original Source From Loader'),
		]);

		expect(result).toEqual(resultMatcher);
		expect(result).toMatchSnapshot();
	});
});
