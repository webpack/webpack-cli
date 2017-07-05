'use strict';
const assert = require('assert');
/* global describe question */
describe('migrate', () => {
	question('Are you sure these changes are fine? (Y/n) ', 'Y', (answer) => {
		assert.equal(answer, 'Y');
	});
});
