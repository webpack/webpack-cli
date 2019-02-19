import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "namedModulesPlugin", "namedModulesPlugin-0");
defineTest(dirName, "namedModulesPlugin", "namedModulesPlugin-1");
defineTest(dirName, "namedModulesPlugin", "namedModulesPlugin-2");
