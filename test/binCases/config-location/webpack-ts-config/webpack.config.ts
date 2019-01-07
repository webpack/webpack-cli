import path from "path";
import webpack from "webpack";

const config: webpack.Configuration = {
	entry: path.resolve(__dirname, "./index2"),
};

export default config;
