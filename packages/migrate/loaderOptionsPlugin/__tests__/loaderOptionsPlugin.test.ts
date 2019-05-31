import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "loaderOptionsPlugin", "loaderOptionsPlugin-0");
defineTest(dirName, "loaderOptionsPlugin", "loaderOptionsPlugin-1");
defineTest(dirName, "loaderOptionsPlugin", "loaderOptionsPlugin-2");
defineTest(dirName, "loaderOptionsPlugin", "loaderOptionsPlugin-3");
