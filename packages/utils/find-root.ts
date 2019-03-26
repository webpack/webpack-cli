import * as findup from "findup-sync";
import * as path from "path";

export function findProjectRoot(): string {
  const rootFilePath = findup(`package.json`);
  const projectRoot = path.dirname(rootFilePath);
  return projectRoot;
}
