"use strict";

const defineTest = require("../../../utils/defineTest");

defineTest(
	__dirname,
	"amd",
	"other-0",
	{
		jQuery: true,
		kQuery: false
	},
	"init"
);
defineTest(__dirname, "bail", "other-0", true, "init");
defineTest(__dirname, "cache", "other-0", true, "init");
defineTest(__dirname, "cache", "other-0", "cacheVal", "init");
defineTest(__dirname, "profile", "other-0", true, "init");
defineTest(__dirname, "merge", "other-0", "myConfig", "init");

defineTest(__dirname, "parallelism", "other-0", 10, "init");
defineTest(
	__dirname,
	"recordsInputPath",
	"other-0",
	"path.join('dist', mine)",
	"init"
);
defineTest(
	__dirname,
	"recordsOutputPath",
	"other-0",
	"path.join('src', yours)",
	"init"
);
defineTest(
	__dirname,
	"recordsPath",
	"other-0",
	"path.join(__dirname, 'records.json')",
	"init"
);

defineTest(
	__dirname,
	"amd",
	"other-1",
	{
		jQuery: false,
		kQuery: true
	},
	"add"
);
defineTest(__dirname, "bail", "other-1", false, "add");
defineTest(__dirname, "cache", "other-1", false, "add");
defineTest(__dirname, "cache", "other-1", "cacheKey", "add");
defineTest(__dirname, "profile", "other-1", false, "add");
defineTest(__dirname, "merge", "other-1", "TheirConfig", "add");

defineTest(__dirname, "parallelism", "other-1", 20, "add");
defineTest(
	__dirname,
	"recordsInputPath",
	"other-1",
	"path.join('dist', ours)",
	"add"
);
defineTest(
	__dirname,
	"recordsOutputPath",
	"other-1",
	"path.join('src', theirs)",
	"add"
);
defineTest(
	__dirname,
	"recordsPath",
	"other-1",
	"path.resolve(__dirname, 'gradle.json')",
	"add"
);
