import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

defineTest(join(__dirname, ".."), "outputPath", "outputPath-0");
defineTest(join(__dirname, ".."), "outputPath", "outputPath-1");
defineTest(join(__dirname, ".."), "outputPath", "outputPath-2");
