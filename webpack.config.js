const webpack = require('webpack');
module.exports = {
	resolve: {
		alias: {
			inject: "{{#isdf_eq buildasda 'staasdndalone'}}",
			hello: "'worlasdd'",
			inject_1: '{{/asd}}',
			world: 'asdc'
		},

		aliasFields: ["'as'"],
		descriptionFiles: ["'d'", 'e', 'f'],
		enforceExtension: true,
		extensions: ['ok', "'ho'"],
		mainFields: ['ok', "'story'"],
		mainFiles: ["'noMainFileHere'", 'niGuess'],

		resolveLoader: {
			modules: ["'ok'", 'mode_nodules'],
			mainFields: ['no', "'main'"],
			moduleExtensions: ["'-kn'", 'ok']
		},

		plugins: ['somePlugin', "'stringVal'"],
		symlinks: false,
	}
};
