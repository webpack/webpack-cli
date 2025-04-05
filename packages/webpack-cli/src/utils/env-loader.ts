import path from "path";
import { normalize } from "path";
// eslint-disable-next-line
import { loadEnvFile } from "process";

export interface EnvLoaderOptions {
  mode?: string;
  dir?: string;
  prefix?: string | string[];
}

export class EnvLoader {
  static getEnvFilePaths(mode = "development", envDir = process.cwd()): string[] {
    return [
      `.env`, // default file
      `.env.local`, // local file
      `.env.${mode}`, // mode file
      `.env.${mode}.local`, // mode local file
    ].map((file) => normalize(path.join(envDir, file)));
  }

  static loadEnvFiles(options: EnvLoaderOptions = {}): Record<string, string> {
    const { mode = process.env.NODE_ENV, dir = process.cwd(), prefix } = options;

    const normalizedPrefixes = prefix ? (Array.isArray(prefix) ? prefix : [prefix]) : ["WEBPACK_"];

    if (mode === "local") {
      throw new Error(
        '"local" cannot be used as a mode name because it conflicts with the .local postfix for .env files.',
      );
    }

    const envFiles = this.getEnvFilePaths(mode, dir);
    const env: Record<string, string> = {};

    // Load all env files
    envFiles.forEach((filePath) => {
      try {
        loadEnvFile(filePath);
      } catch {
        // Skip if file doesn't exist
      }
    });

    // Filter env vars based on prefix
    for (const [key, value] of Object.entries(process.env)) {
      if (normalizedPrefixes.some((prefix) => key.startsWith(prefix))) {
        env[key] = value as string;
      }
    }

    return env;
  }
}
