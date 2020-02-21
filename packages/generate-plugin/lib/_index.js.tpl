/**
 * See the webpack docs for more information about plugins:
 * https://github.com/webpack/docs/wiki/how-to-write-a-plugin
 */

function <%= name %>(options) {
	// Setup the plugin instance with options...
}

<%= name %>.prototype.apply = function(compiler) {
	compiler.plugin('done', function() {
		console.log('Hello World!');
	});
};

module.exports = <%= name %>;
