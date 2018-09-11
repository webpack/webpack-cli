module.exports = {
	name: "webpack-cli",
	mode: "modules",
	out: "docs",
	"external-modulemap": ".*packages\/(@webpack-cli\/[^\/]+)\/.*"
};
