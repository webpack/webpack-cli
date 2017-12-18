"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"stats",
	"stats-0",
	{
		assets: true,
		assetsSort: "'field'",
		cached: true,
		cachedAssets: true,
		children: true,
		chunks: true,
		chunkModules: true,
		chunkOrigins: true,
		chunksSort: "'field'",
		context: "'../src/'",
		colors: true,
		depth: false,
		entrypoints: "customVal",
		errors: true,
		errorDetails: true,
		exclude: [],
		hash: true,
		maxModules: 15,
		modules: true,
		modulesSort: "'field'",
		performance: true,
		providedExports: false,
		publicPath: true,
		reasons: true,
		source: true,
		timings: true,
		usedExports: false,
		version: true,
		warnings: true
	},
	"init"
);
defineTest(__dirname, "stats", "stats-0", "'errors-only'", "init");

defineTest(
	__dirname,
	"stats",
	"stats-0",
	{
		assets: true,
		assetsSort: "'naw'",
		cached: true,
		cachedAssets: true,
		children: true,
		chunks: true,
		version: true,
		warnings: false
	},
	"add"
);
defineTest(
	__dirname,
	"stats",
	"stats-1",
	{
		assets: true,
		assetsSort: "'naw'",
		cached: true,
		cachedAssets: true,
		children: true,
		chunks: true,
		version: true,
		warnings: false
	},
	"add"
);
defineTest(__dirname, "stats", "stats-1", "'errors-only'", "add");
