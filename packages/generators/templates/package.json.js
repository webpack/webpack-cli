module.exports = isProd => {
	let scripts = {
		build: "webpack"
	};
	if (!isProd) {
		scripts.start = "webpack-dev-server";
	}

	return {
		version: "1.0.0",
		description: "My webpack project",
		scripts
	};
};
