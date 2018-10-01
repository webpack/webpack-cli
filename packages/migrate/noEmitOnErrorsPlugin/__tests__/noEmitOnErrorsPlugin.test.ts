import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";
defineTest(
  join(__dirname, ".."),
  "noEmitOnErrorsPlugin",
  "noEmitOnErrorsPlugin-0",
);
defineTest(
  join(__dirname, ".."),
  "noEmitOnErrorsPlugin",
  "noEmitOnErrorsPlugin-1",
);
defineTest(
  join(__dirname, ".."),
  "noEmitOnErrorsPlugin",
  "noEmitOnErrorsPlugin-2",
);
