import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "outputPath", "outputPath-0");
defineTest(dirName, "outputPath", "outputPath-1");
defineTest(dirName, "outputPath", "outputPath-2");
