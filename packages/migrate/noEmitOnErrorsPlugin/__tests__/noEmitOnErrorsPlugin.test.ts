import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "noEmitOnErrorsPlugin", "noEmitOnErrorsPlugin-0");
defineTest(dirName, "noEmitOnErrorsPlugin", "noEmitOnErrorsPlugin-1");
defineTest(dirName, "noEmitOnErrorsPlugin", "noEmitOnErrorsPlugin-2");
