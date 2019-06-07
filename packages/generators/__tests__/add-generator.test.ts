import { generatePluginName } from "../utils";

describe("generatePluginName", () => {
	it("should return webpack Standard Plugin Name for Name : extract-text-webpack-plugin", () => {
		const pluginName = generatePluginName("extract-text-webpack-plugin");
		expect(pluginName).toEqual("ExtractTextWebpackPlugin");
	});

	it("should return webpack Standard Plugin Name for Name : webpack.DefinePlugin", () => {
		const pluginName = generatePluginName("webpack.DefinePlugin");
		expect(pluginName).toEqual("webpack.DefinePlugin");
	});
});
