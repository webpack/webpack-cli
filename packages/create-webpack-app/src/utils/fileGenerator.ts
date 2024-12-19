import * as fs from "fs/promises";
import * as ejs from "ejs";
import { expand } from "@inquirer/prompts";
import { spawn, sync } from "cross-spawn";
import * as path from "path";
import { fileURLToPath } from "url";
import { logger } from "./logger.js";
import { type NodePlopAPI } from "node-plop";
import { type Answers } from "../types";

export interface AddConfig {
  type: string; // Type of action
  path: string;
  fileType: "text" | "binary";
  template?: string;
  templateFile?: string;
  skipIfExists?: boolean;
  transform?: (content: string, data: Answers | undefined) => string | Promise<string>; // transforms rendered string before writing to file
  skip?: (data: Answers | undefined) => string | Promise<string>; // skips the action and logs the reason returned by the function
  force?: boolean; // Force overwrite
  data?: Answers; // Data for EJS template rendering
  abortOnFail?: boolean; // Abort on failure
}

export type Content = string | Buffer;
export interface Result {
  status: "create" | "skip" | "overwrite" | "error" | "identical";
  content: Content;
}

export interface GlobalConfig {
  overwriteAll: boolean;
}

const globalConfig: GlobalConfig = { overwriteAll: false };

async function doesFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function checkIfCodeInstalled(): boolean {
  try {
    const result = sync("code", ["--version"], { stdio: "ignore" });
    return result.status === 0;
  } catch {
    return false;
  }
}

function getDiff(filePath: string, tempFilePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const platform = process.platform;
    let editor = "";

    // Determine the editor based on platform and availability of VS Code
    if (platform === "win32") {
      if (checkIfCodeInstalled()) {
        editor = "code";
      } else {
        return reject(
          new Error("Visual Studio Code is not installed. Please install VS Code to continue."),
        );
      }
    } else if (platform === "darwin" || platform === "linux") {
      editor = checkIfCodeInstalled() ? "code" : "vim";
    } else {
      return reject(new Error(`Unsupported platform: ${platform}`));
    }

    // Construct the appropriate diff command
    let diffCommand = "";

    if (editor === "code") {
      diffCommand = `${editor} --diff ${filePath} ${tempFilePath}`;
    } else if (editor === "vim") {
      diffCommand = `${editor} -d ${filePath} ${tempFilePath}`;
    }

    // Execute the diff command
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
): Promise<Content> {
  if (template) {
    return ejs.render(template, data || {}, { async: true });
  }

  if (templateFile) {
    const templateContent = await fs.readFile(templateFile, "utf8");
    return ejs.render(templateContent, data || {}, { async: true });
  }

  throw new Error("Template or templateFile is required");
}

async function checkAndPrepareContent(config: AddConfig, isTemplate: boolean): Promise<Result> {
  const fileExists = await doesFileExists(config.path);
  let existingFileContent: Content = "";
  let newContent: Content = "";

  // Handle template or binary content
  if (isTemplate) {
    // Template rendering for non-binary files
    newContent = await renderTemplate(config.template, config.templateFile, config.data);

    if (config.transform && typeof config.transform === "function") {
      newContent = await config.transform(newContent as string, config.data);
    }
  } else {
    // Read binary content for binary files
    newContent = await fs.readFile(config.templateFile as string);
  }

  // Check if overwriteAll is set globally
  if (globalConfig.overwriteAll) {
    return { status: "overwrite", content: newContent };
  }

  // Check if skip condition exists
  if (config.skip && typeof config.skip === "function") {
    const skipReason = await config.skip(config.data);
    logger.info(` - ${skipReason}`);
    return { status: "skip", content: existingFileContent || newContent };
  }

  // Read existing content if the file exists
  if (fileExists) {
    existingFileContent = await fs.readFile(config.path);

    // If skipIfExists is set, skip writing the file
    if (config.skipIfExists) {
      return { status: "skip", content: existingFileContent };
    }

    // If force is set, overwrite the file
    if (config.force) {
      return { status: "overwrite", content: newContent };
    }

    // If the contents are identical (text or binary), return identical status
    if (existingFileContent == newContent) {
      return { status: "identical", content: existingFileContent };
    }

    // Prompt for conflict resolution
    const tempFilePath = path.join("/tmp", `temp_${path.basename(config.path)}`);
    await fs.writeFile(tempFilePath, newContent || "");

    let userChoice: Result | undefined;
    while (!userChoice) {
      const action = await expand({
        message: `File conflict at ${path.basename(config.path)}?`,
        choices: [
          { key: "y", name: "overwrite", value: "overwrite" },
          { key: "n", name: "do not overwrite", value: "skip" },
          { key: "a", name: "overwrite this and all others", value: "overwrite_all" },
          {
            key: "d",
            name: `Show the difference${!isTemplate ? " (size/modified date)" : ""}`,
            value: "diff",
          },
          { key: "x", name: "abort", value: "abort" },
        ],
        expanded: false,
      });

      switch (action) {
        case "overwrite":
          userChoice = { status: "overwrite", content: newContent };
          break;
        case "skip":
          userChoice = { status: "skip", content: existingFileContent };
          break;
        case "overwrite_all":
          globalConfig.overwriteAll = true;
          return { status: "overwrite", content: newContent };
        case "diff":
          if (!isTemplate && Buffer.isBuffer(existingFileContent)) {
            const existingStats = await fs.stat(config.path);
            const newStats = await fs.stat(tempFilePath);
            const headers = `| ${"File".padEnd(15)} | ${"Size (bytes)".padEnd(
              15,
            )} | ${"Last Modified".padEnd(25)} |`;
            const separator = "-".repeat(headers.length);

            const existingRow = `| ${"Existing File".padEnd(15)} | ${existingStats.size
              .toString()
              .padEnd(15)} | ${existingStats.mtime.toISOString().padEnd(25)} |`;
            const newRow = `| ${"New File".padEnd(15)} | ${newStats.size
              .toString()
              .padEnd(15)} | ${newStats.mtime.toISOString().padEnd(25)} |`;

            logger.info(separator);
            logger.info(headers);
            logger.info(separator);
            logger.info(existingRow);
            logger.info(newRow);
            logger.info(separator);
          } else {
            await getDiff(config.path, tempFilePath);
          }
          break;
        case "abort":
          logger.error("Aborting process...");
          process.exit(1);
      }
    }

    await fs.unlink(tempFilePath).catch(() => {
      logger.warn(`Failed to delete temporary file: ${tempFilePath}`);
    });

    return userChoice;
  } else {
    // If the file doesn't exist, create it
    return { status: "create", content: newContent };
  }
}
export default async function (plop: NodePlopAPI) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  plop.setPlopfilePath(path.resolve(__dirname, "../plopfile.js"));
  plop.setDefaultInclude({ actions: true });

  plop.setActionType("fileGenerator", async (answers, config) => {
    const isTemplate = config.fileType === "text";
    const result = await checkAndPrepareContent(
      { ...config, data: answers } as AddConfig,
      isTemplate,
    );
    let returnString = "";
    switch (result.status) {
      case "create":
      case "overwrite":
        // Write the content to the file (handle text or binary)

        await fs.mkdir(path.dirname(config.path), { recursive: true });
        await fs.writeFile(config.path, result.content);
        returnString = `${result.status}|${config.path}`;
        break;

      case "skip":
        returnString = `${result.status}|${config.path}`;
        break;

      case "identical":
        returnString = `${result.status}|${config.path}`;
        break;
    }
    return returnString;
  });
}
