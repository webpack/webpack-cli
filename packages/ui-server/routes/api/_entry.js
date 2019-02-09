const webpackEntryPoint = {};
function forEachPromise(entries, fn) {
	return entries.reduce((promise, prop) => {
		const trimmedProp = prop.trim();

		return promise.then((n) => {
			if (n) {
				Object.keys(n).forEach((val) => {
					if (
						n[val].charAt(0) !== "(" &&
						n[val].charAt(0) !== "[" &&
						!n[val].includes("function") &&
						!n[val].includes("path") &&
						!n[val].includes("process")
					) {
						n[val] = `\'${n[val].replace(/"|'/g, "").concat(".js")}\'`;
					}
					webpackEntryPoint[val] = n[val];
				});
			} else {
				n = {};
			}
			return fn(trimmedProp);
		});
	}, Promise.resolve());
}

module.exports = function(questioner, answer) {
	if (answer === true) {
		return questioner.question({
			action: "question",
			question: "Type the names you want for your entry files",
			type: "array"
		}).then((entries) => {
			return forEachPromise(entries, (entryProp) => {
				return questioner.question({
					action: "question",
					question: `What is the location of "${entryProp}"? [example: ./src/${entryProp}]`
				});
			}).then((entryPropAnswer) => {
				Object.keys(entryPropAnswer).forEach(val => {
					if (
						entryPropAnswer[val].charAt(0) !== "(" &&
						entryPropAnswer[val].charAt(0) !== "[" &&
						!entryPropAnswer[val].includes("function") &&
						!entryPropAnswer[val].includes("path") &&
						!entryPropAnswer[val].includes("process")
					) {
						entryPropAnswer[val] = `\'${entryPropAnswer[val]
							.replace(/"|'/g, "")
							.concat(".js")}\'`;
					}
					webpackEntryPoint[val] = entryPropAnswer[val];
				});
				return webpackEntryPoint;
			});
		});
	} else {
		return questioner.question({
			action: "question",
			question: "Which module will be the first to enter the application?"
		}).then((singularEntryAnswer) => {
			let singularEntry = singularEntryAnswer;
			if (singularEntry.indexOf("\"") >= 0) {
				singularEntry = singularEntry.replace(/"/g, "'");
			}
			return singularEntry;
		});
	}
};
