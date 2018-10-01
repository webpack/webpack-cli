import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

defineTest(join(__dirname, ".."), "commonsChunkPlugin", "commonsChunkPlugin-0");
defineTest(join(__dirname, ".."), "commonsChunkPlugin", "commonsChunkPlugin-1");
defineTest(join(__dirname, ".."), "commonsChunkPlugin", "commonsChunkPlugin-2");
defineTest(join(__dirname, ".."), "commonsChunkPlugin", "commonsChunkPlugin-3");
defineTest(join(__dirname, ".."), "commonsChunkPlugin", "commonsChunkPlugin-4");
defineTest(join(__dirname, ".."), "commonsChunkPlugin", "commonsChunkPlugin-5");
defineTest(
  join(__dirname, ".."),
  "commonsChunkPlugin",
  "commonsChunkPlugin-6a",
);
defineTest(
  join(__dirname, ".."),
  "commonsChunkPlugin",
  "commonsChunkPlugin-6b",
);
defineTest(
  join(__dirname, ".."),
  "commonsChunkPlugin",
  "commonsChunkPlugin-6c",
);
defineTest(
  join(__dirname, ".."),
  "commonsChunkPlugin",
  "commonsChunkPlugin-6d",
);
defineTest(join(__dirname, ".."), "commonsChunkPlugin", "commonsChunkPlugin-7");
