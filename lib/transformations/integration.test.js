const fs = require('fs');
const path = require('path');
const transform = require('./').transform;
const no_of_files = 1;

const runTest = (currentConfigPath) => {

	let currentConfig = fs.readFileSync(currentConfigPath, 'utf8');
	const outputConfig = transform(currentConfig);
	expect(outputConfig).toMatchSnapshot();
};

describe('Run integration tests', () => {
	for(let i =1; i<= no_of_files; i++){
		test(`run test - webpack${i}.config.js`, () => {
			const filePath = path.resolve(process.cwd(), './lib/transformations/__testfixtures__/webpack' + i + '.config.js');
			runTest(filePath);
		});
	}
});
