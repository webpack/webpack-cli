import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

const dirName: string = join(__dirname, "..");

defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-0");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-1");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-2");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-3");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-4");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-5");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-6a");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-6b");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-6c");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-6d");
defineTest(dirName, "commonsChunkPlugin", "commonsChunkPlugin-7");
