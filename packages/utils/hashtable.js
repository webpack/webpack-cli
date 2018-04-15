/**
 * Combined hashtable that sorts duplicate elements
 * https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
 *
 * @param {Array} a Array to lookup
 * @returns {Array} A sorted array with removed dupe elements
 */
module.exports = function hashtable(a) {
	const prims = { boolean: {}, number: {}, string: {} },
		objs = [];

	return a.filter(function(item) {
		const type = typeof item;
		if (type in prims)
			return prims[type].hasOwnProperty(item)
				? false
				: (prims[type][item] = true);
		else return objs.indexOf(item) >= 0 ? false : objs.push(item);
	});
};
