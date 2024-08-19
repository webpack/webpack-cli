import * as fs from "fs/promises";
import * as ejs from "ejs";
import { expand } from "@inquirer/prompts";
import { spawn } from "cross-spawn";
import * as path from "path";
import { fileURLToPath } from "url";
// eslint-disable-next-line node/no-missing-import
import { logger } from "./logger.js";
import { Answers, NodePlopAPI } from "../types";

export interface GlobalConfig {
  overwriteAll: boolean;
}
export interface AddConfig {
  operationType?: string; // type of operation to be performed
  type: string; // Type of action
  path: string; // EJS template for file path
  template?: string; // EJS template for file content
  templateFile?: string; // Path to a file containing the EJS template
  skipIfExists?: boolean; // Skip if file exists
  transform?: (content: string, data: object) => string | Promise<string>; // Optional transform function
  skip?: (data: object) => boolean | Promise<boolean>; // Skip function
  force?: boolean; // Force overwrite
  data?: Answers; // Data for EJS template rendering
  abortOnFail?: boolean; // Abort on failure
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const globalConfig: GlobalConfig = { overwriteAll: false };
const binaryExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".pdf"];

function isBinaryFile(fileName: string | undefined): boolean {
  if (!fileName) return false;
  const fileNameWithoutTpl = path.basename(fileName, ".tpl");

  return binaryExtensions.includes(path.extname(fileNameWithoutTpl).toLowerCase());
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function compareContentWithFile(filePath: string, content: string): Promise<boolean> {
  try {
    const existingContent = await fs.readFile(filePath, "utf8");
    return existingContent === content;
  } catch {
    return false;
  }
}

function getDiff(filePath: string, tempFilePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const editor = "code";
    const diffCommand = `${editor} --diff ${filePath} ${tempFilePath}`;

    const diffProcess = spawn(diffCommand, { shell: true, stdio: "inherit" });

    diffProcess.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error("Error opening diff in editor"));
      } else {
        resolve();
      }
    });
  });
}

async function renderTemplate(
  template: string | undefined,
  templateFile: string | undefined,
  data: Answers | undefined,
): Promise<string | Buffer | undefined> {
  if (template) {
    return ejs.render(template, data || {}, { async: true });
  }

  if (templateFile) {
    if (isBinaryFile(templateFile)) {
      return fs.readFile(templateFile);
    }

    const templateContent = await fs.readFile(templateFile, "utf8");
    return ejs.render(templateContent, data || {}, { async: true });
  }

  return undefined;
}

async function checkAndPrepareAction(config: AddConfig): Promise<AddConfig> {
  if (globalConfig?.overwriteAll) {
    return { ...config, force: true, operationType: "overwrite" };
  }

  if (!config.path) {
    throw new Error("Path is required");
  }

  const renderedPath = config.path;

  if (config.skip && (await config.skip(config.data || {}))) {
    return { ...config, skip: () => true, operationType: "skip" };
  }

  const fileAlreadyExists = await fileExists(renderedPath);

  let content = await renderTemplate(config.template, config.templateFile, config.data);

  if (config.transform && typeof content === "string") {
    content = await config.transform(content, config.data || {});
  }

  if (!fileAlreadyExists) {
    return { ...config, operationType: "create" };
  }

  if (config.skipIfExists) {
    return { ...config, skip: () => true, operationType: "skip" };
  }

  if (config.force) {
    return config;
  }

  if (typeof content === "string") {
    const identicalContent = await compareContentWithFile(renderedPath, content);
    if (identicalContent) {
      return { ...config, skip: () => true, operationType: "identical" };
    }
  }

  const tempFilePath = path.join("/tmp", `temp_${path.basename(renderedPath)}`);
  await fs.writeFile(tempFilePath, content || "");

  try {
    let userChoice: AddConfig | undefined;
    while (!userChoice) {
      const action = await expand({
        message: `File conflict at ${path.basename(renderedPath)}?`,
        choices: [
          { key: "y", name: "overwrite", value: "overwrite" },
          { key: "n", name: "do not overwrite", value: "skip" },
          { key: "a", name: "overwrite this and all others", value: "overwrite_all" },
          {
            key: "d",
            name: "Show the difference between the existing file and the new file",
            value: "diff",
          },
          { key: "x", name: "abort", value: "abort" },
        ],
        expanded: false,
      });

      switch (action) {
        case "overwrite":
          userChoice = { ...config, operationType: "overwrite" };
          break;
        case "skip":
          userChoice = { ...config, skip: () => true, operationType: "skip" };
          break;
        case "overwrite_all":
          globalConfig.overwriteAll = true;
          return { ...config, force: true, operationType: "overwrite" };
        case "diff":
          await getDiff(renderedPath, tempFilePath);
          break;
        case "abort":
          logger.error("Aborting process...");
          process.exit(1);
      }
    }
    return userChoice;
  } finally {
    await fs.unlink(tempFilePath).catch(() => {
      logger.warn(`Failed to delete temporary file: ${tempFilePath}`);
    });
  }
}

export default async function (plop: NodePlopAPI) {
  plop.setPlopfilePath(path.resolve(__dirname, "../plopfile.js"));
  plop.setDefaultInclude({ actions: true });

  plop.setActionType("fileActions", async (answers, config) => {
    const initialConfig = { ...config, data: answers, operationType: "create" } as AddConfig;
    const finalConfig = await checkAndPrepareAction(initialConfig);

    const renderedPath = finalConfig.path;
    const operationType = finalConfig.operationType;
    const templatePath = finalConfig.templateFile;

    if (finalConfig.skip) {
      return `${operationType}:${renderedPath}`;
    }

    const content = await renderTemplate(
      finalConfig.template,
      finalConfig.templateFile,
      finalConfig.data,
    );

    if (!content) {
      throw new Error("Template or templateFile is required");
    }

    await fs.mkdir(path.dirname(renderedPath), { recursive: true });

    if (isBinaryFile(templatePath)) {
      await fs.writeFile(renderedPath, content as Buffer);
    } else {
      await fs.writeFile(renderedPath, content as string, "utf8");
    }

    return `${operationType}:${renderedPath}`;
  });
}
