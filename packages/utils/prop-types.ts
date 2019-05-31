/**
 *
 * A Set of all accepted properties
 *
 * @returns {Set} A new set with accepted webpack properties
 */

const PROP_TYPES: Set<string> = new Set([
	"amd",
	"bail",
	"cache",
	"context",
	"devServer",
	"devtool",
	"entry",
	"externals",
	"merge",
	"mode",
	"module",
	"node",
	"optimization",
	"output",
	"parallelism",
	"performance",
	"plugins",
	"profile",
	"recordsInputPath",
	"recordsOutputPath",
	"recordsPath",
	"resolve",
	"resolveLoader",
	"splitChunks",
	"stats",
	"target",
	"topScope",
	"watch",
	"watchOptions"
]);

export default PROP_TYPES;
