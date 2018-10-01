import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

defineTest(join(__dirname, ".."), "bannerPlugin", "bannerPlugin-0");
defineTest(join(__dirname, ".."), "bannerPlugin", "bannerPlugin-1");
defineTest(join(__dirname, ".."), "bannerPlugin", "bannerPlugin-2");
