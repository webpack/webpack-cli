import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "bannerPlugin", "bannerPlugin-0");
defineTest(dirName, "bannerPlugin", "bannerPlugin-1");
defineTest(dirName, "bannerPlugin", "bannerPlugin-2");
