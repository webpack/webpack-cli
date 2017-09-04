export default function loader(source) {
	const { loaders, resource, request, version, webpack } = this;

	const newSource = `
	/**
	 * <%= name %>
	 *
	 * Resource Location: ${resource}
	 * Loaders chainded to module: ${JSON.stringify(loaders)}
	 * Loader API Version: ${version}
	 * Is this in "webpack mode": ${webpack}
	 * This is the users request for the module: ${request}
	 */
	/**
	 * Original Source From Loader
	 */
	${source}`;

	return newSource;
}
