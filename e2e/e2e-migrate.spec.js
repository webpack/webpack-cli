'use strict';

describe('webpack migrate', () => {
	it('should migrate a webpack.config.js', () => {
		// eslint-disable-next-line
		const webpackConfigBeforeMigrate = require('./testfixtures/webpack.config.before.js');
		const webpackConfigAfterMigrate = require('./testfixtures/webpack.config.js');
		expect(webpackConfigBeforeMigrate).not.toEqual(webpackConfigAfterMigrate);
	});
});
