// eslint-disable-next-line node/no-unsupported-features, node/no-unsupported-features/es-syntax
import path from "path";

const config = {
	entry: path.resolve(__dirname, "./index2"),
	output: {
		filename: "es6.js"
	}
};

// eslint-disable-next-line node/no-unsupported-features, node/no-unsupported-features/es-syntax
export default config;
