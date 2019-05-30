import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "moduleConcatenationPlugin", "moduleConcatenationPlugin-0");
defineTest(dirName, "moduleConcatenationPlugin", "moduleConcatenationPlugin-1");
defineTest(dirName, "moduleConcatenationPlugin", "moduleConcatenationPlugin-2");
