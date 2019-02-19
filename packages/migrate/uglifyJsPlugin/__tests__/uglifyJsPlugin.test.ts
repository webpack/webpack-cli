import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "uglifyJsPlugin", "uglifyJsPlugin-0");
defineTest(dirName, "uglifyJsPlugin", "uglifyJsPlugin-1");
defineTest(dirName, "uglifyJsPlugin", "uglifyJsPlugin-2");
defineTest(dirName, "uglifyJsPlugin", "uglifyJsPlugin-3");
defineTest(dirName, "uglifyJsPlugin", "uglifyJsPlugin-4");
