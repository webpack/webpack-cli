"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"resolve",
	"resolve-0",
	{
		alias: {
			inject: "{{#if_eq build 'standalone'}}",
			hello: "'world'",
			inject_1: "{{/if_eq}}",
			world: "hello"
		},
		aliasFields: ["'browser'", "wars"],
		descriptionFiles: ["'a'", "b"],
		enforceExtension: false,
		enforceModuleExtension: false,
		extensions: ["hey", "'ho'"],
		mainFields: ["main", "'story'"],
		mainFiles: ["'noMainFileHere'", "iGuess"],
		modules: ["one", "'two'"],
		unsafeCache: false,
		resolveLoader: {
			modules: ["'node_modules'", "mode_nodules"],
			extensions: ["jsVal", "'.json'"],
			mainFields: ["loader", "'main'"],
			moduleExtensions: ["'-loader'", "value"]
		},
		plugins: ["somePlugin", "'stringVal'"],
		symlinks: true
	},
	"init"
);

defineTest(
	__dirname,
	"resolve",
	"resolve-1",
	{
		alias: {
			inject: "{{#isdf_eq buildasda 'staasdndalone'}}",
			hello: "'worlasdd'",
			inject_1: "{{/asd}}",
			world: "asdc"
		},
		aliasFields: ["'as'"],
		descriptionFiles: ["'d'", "e", "f"],
		enforceExtension: true,
		extensions: ["ok", "'ho'"],
		mainFields: ["ok", "'story'"],
		mainFiles: ["'noMainFileHere'", "niGuess"],
		resolveLoader: {
			modules: ["'ok'", "mode_nodules"],
			mainFields: ["no", "'main'"],
			moduleExtensions: ["'-kn'", "ok"]
		},
		plugins: ["somePlugin", "'stringVal'"],
		symlinks: false
	},
	"add"
);
