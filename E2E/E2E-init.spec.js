'use strict';

const fs = require('fs');

describe('webpack-cli init', () => {
	it('should create a webpack.config.js', () => {
		expect(fs.existsSync(process.cwd() + '/webpack.dev.js')).toBe(true);
	});
});
