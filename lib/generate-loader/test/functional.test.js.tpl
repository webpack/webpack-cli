import {
	runWebpackExampleInMemory,
} from '../test/test-utils';

test('should run with no errors or warnings', async () => {
	const buildStats = await runWebpackExampleInMemory('simple');
	const { errors, warnings } = buildStats;

	expect([...errors, ...warnings].length).toBe(0);
});

test('should append transformations to JavaScript module', async () => {
	const buildStats = await runWebpackExampleInMemory('simple');
	const { modules } = buildStats;

	const moduleToTest = modules[0].source()._source._value;
	const loadedString = '* Original Source From Loader';

	expect(moduleToTest).toEqual(expect.stringContaining(loadedString));
	expect(moduleToTest).toMatchSnapshot();
});
