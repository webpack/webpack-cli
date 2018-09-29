import defineTest from "@webpack-cli/utils/defineTest";
import { join } from "path";

defineTest(
  join(__dirname, ".."),
  "moduleConcatenationPlugin",
  "moduleConcatenationPlugin-0",
);
defineTest(
  join(__dirname, ".."),
  "moduleConcatenationPlugin",
  "moduleConcatenationPlugin-1",
);
defineTest(
  join(__dirname, ".."),
  "moduleConcatenationPlugin",
  "moduleConcatenationPlugin-2",
);
