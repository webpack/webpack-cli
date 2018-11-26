class GroupHelper {
	constructor(options) {
		this.args = this.arrayToObject(options);
		this.opts = {
			outputOptions: {},
			options: {},
			processingErrors: []
		};
	}

	hyphenToUpperCase(name) {
		if(!name) {
			return name;
		}
		return name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
	  }
	mergeRecursive(acc, curr) {
	for (var p in curr) {
		try {
			// Property in destination object set; update its value.
			if ( curr[p].constructor==Object ) {
			acc[p] = this.mergeRecursive(acc[p], curr[p]);

			} else {
			acc[p] = curr[p];

			}

		} catch(e) {
			// Property in destination object not set; create it and set its value.
			acc[p] = curr[p];

		}
		}

		return acc;
	}
	arrayToObject(arr) {
		if(!arr) {
			return;
		}
		var result = {};
		let arrLength = arr.length;
		for (let i = 0; i < arrLength; i++) {
			let key = Object.keys(arr[i])[0];
			const val = arr[i][key];
			result[this.hyphenToUpperCase(key)] = val;
		}
		return result;
	}
	verifyType(key, val) {
		/*  if(!schemaProp.includes(val)) {
            const errMsg = 'Unrecognized Option: ' + val + ' supplied to ' + key;
            this.errors.push(errMsg);
        } */
	}
	mapArgToBoolean(name, optionName) {
		ifArg(name, function(bool) {
			if (bool === true) options[optionName || name] = true;
			else if (bool === false) options[optionName || name] = false;
		});
	}

	loadPlugin(name) {
		const loadUtils = require("loader-utils");
		let args;
		try {
			const p = name && name.indexOf("?");
			if (p > -1) {
				args = loadUtils.parseQuery(name.substring(p));
				name = name.substring(0, p);
			}
		} catch (e) {
			console.error("Invalid plugin arguments " + name + " (" + e + ").");
			process.exit(-1); // eslint-disable-line
		}

		let path;
		try {
			const resolve = require("enhanced-resolve");
			path = resolve.sync(process.cwd(), name);
		} catch (e) {
			console.error("Cannot resolve plugin " + name + ".");
			process.exit(-1); // eslint-disable-line
		}
		let Plugin;
		try {
			Plugin = require(path);
		} catch (e) {
			console.error("Cannot load plugin " + name + ". (" + path + ")");
			throw e;
		}
		try {
			return new Plugin(args);
		} catch (e) {
			console.error("Cannot instantiate plugin " + name + ". (" + path + ")");
			throw e;
		}
	}

	ensureObject(parent, name, force) {
		if (force || typeof parent[name] !== "object" || parent[name] === null) {
			parent[name] = {};
		}
	}

	ensureArray(parent, name) {
		if (!Array.isArray(parent[name])) {
			parent[name] = [];
		}
	}

	addPlugin(options, plugin) {
		ensureArray(options, "plugins");
		options.plugins.unshift(plugin);
	}

	bindRules(arg) {
		ifArgPair(
			arg,
			(name, binding) => {
				if (name === null) {
					name = binding;
					binding += "-loader";
				}
				const rule = {
					test: new RegExp(
						"\\." +
							name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") +
							"$"
					), // eslint-disable-line no-useless-escape
					loader: binding
				};
				if (arg === "module-bind-pre") {
					rule.enforce = "pre";
				} else if (arg === "module-bind-post") {
					rule.enforce = "post";
				}
				options.module.rules.push(rule);
			},
			() => {
				ensureObject(options, "module");
				ensureArray(options.module, "rules");
			}
		);
	}
}

module.exports = GroupHelper;
