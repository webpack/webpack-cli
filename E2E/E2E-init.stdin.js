'use strict';
const assert = require('assert');
/* global describe question */

// Webpack-cli -> soren binPath="YourPathToWebpackCLI" -- init
// Alternatively, clone webpack-cli and run 'Soren' inside the repo

describe('webpack', () => {
	question('Will your application have multiple bundles? (Y/n)', 'n', (answer) => {
		assert.equal(answer, 'n');
	});

	question('Which module will be the first to enter the application?', 'app.js', (answer) => {
		assert.equal(answer, 'app.js');
	});

	question('Which folder will your generated bundles be in? [default: dist]:',
    './dist', (answer) => {
	assert.equal(answer, './dist');
});

	question('Are you going to use this in production? (Y/n)', 'Y', (answer) => {
		assert.equal(answer, 'Y');
	});

	question('Will you be using ES2015? (Y/n)', 'Y', (answer) => {
		assert.equal(answer, 'Y');
	});

	question(` Will you use one of the below CSS solutions?
  1) SASS
  2) LESS
  3) CSS
  4) PostCSS
  5) No
  Answer:`, 2, (answer) => {
	assert.equal(answer, 2);
});
	question(`If you want to bundle your CSS files, what will you name the bundle? (press en
ter to skip)`, 'enter', (answer) => {
	assert.equal(answer, 'enter');
});

	question('Name your \'webpack.[name].js?\' [default: \'prod\']:', 'dev', (answer) => {
		assert.equal(answer, 'dev');
	});
});
