import { join } from "path";
import { isLocalPath, findProjectRoot } from "../path-utils";

describe("path-utils tests", () => {
  it("isLocalPath Testing : __dirname", () => {
    const answer = isLocalPath(join(__dirname, "../../"));
    expect(answer).toBe(true);
  });
  it("findProjectRoot testing", () => {
    const answer = findProjectRoot();
    expect(answer).toBe(process.cwd());
  });
});
