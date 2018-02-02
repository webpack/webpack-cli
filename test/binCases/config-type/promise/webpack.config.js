module.exports = new Promise((resolve, reject) => {
	resolve({
		entry: "./entry",
		output: {
			filename: "entry.bundle.js"
		}
	});
});
