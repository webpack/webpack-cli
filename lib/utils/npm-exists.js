const got = require('got');

const npmSource = {
	taobao: 'https://npm.taobao.org',
	npm: 'https://www.npmjs.org'
};

const constant = value => () => value;

function npmExists(moduleName, source) {
	const hostname = npmSource[source] || source || npmSource.npm;
	const pkgUrl = `${hostname}/package/${moduleName}`;
	return got(pkgUrl, {method: 'HEAD'})
		.then(constant(true))
		.catch(constant(false));
}

module.exports = npmExists;
