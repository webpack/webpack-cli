class ErrorHelper {
	constructor() {
		this.errors = [];
	}

	processOptions(opts) {
		return {
			errors: this.errors,
			opts
		};
	}
	arrayToObject(arr) {
		var result = {};
		let arrLength = arr.length;
		for (let i = 0; i < arrLength; i++) {
			const key = Object.keys(arr[i])[0];
			const val = arr[i][key];
			result[key] = val;
		}
		return result;
	}
	verifyType(key, val) {
		/*  if(!schemaProp.includes(val)) {
            const errMsg = 'Unrecognized Option: ' + val + ' supplied to ' + key;
            this.errors.push(errMsg);
        } */
	}
}

module.exports = ErrorHelper;
