"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe("generatePluginName", () => {
    it("should return webpack Standard Plugin Name for Name : extract-text-webpack-plugin", () => {
        const pluginName = utils_1.generatePluginName("extract-text-webpack-plugin");
        expect(pluginName).toEqual("ExtractTextWebpackPlugin");
    });
    it("should return webpack Standard Plugin Name for Name : webpack.DefinePlugin", () => {
        const pluginName = utils_1.generatePluginName("webpack.DefinePlugin");
        expect(pluginName).toEqual("webpack.DefinePlugin");
    });
});
//# sourceMappingURL=add-generator.test.js.map