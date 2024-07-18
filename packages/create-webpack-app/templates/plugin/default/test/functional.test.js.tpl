import {
	runWebpackExampleInMemory,
} from '../test/test-utils';

test('should run with no errors or warnings', async () => {
	const buildStats = await runWebpackExampleInMemory('simple');
	const { errors, warnings } = buildStats;

	expect([...errors, ...warnings].length).toBe(0);
});
