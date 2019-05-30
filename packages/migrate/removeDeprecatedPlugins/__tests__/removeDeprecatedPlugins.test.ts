import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "removeDeprecatedPlugins", "removeDeprecatedPlugins-0");
defineTest(dirName, "removeDeprecatedPlugins", "removeDeprecatedPlugins-1");
defineTest(dirName, "removeDeprecatedPlugins", "removeDeprecatedPlugins-2");
defineTest(dirName, "removeDeprecatedPlugins", "removeDeprecatedPlugins-3");
defineTest(dirName, "removeDeprecatedPlugins", "removeDeprecatedPlugins-4");
