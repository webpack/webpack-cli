import path from "path";
import { normalize } from "path";
// eslint-disable-next-line
import { loadEnvFile } from "process";

export interface EnvLoaderOptions {
  mode?: string;
  envDir?: string;
  prefixes?: string | string[];
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
    const {
      mode = process.env.NODE_ENV || "development",
      envDir = process.cwd(),
      prefixes,
    } = options;

    const normalizedPrefixes = prefixes
      ? Array.isArray(prefixes)
        ? prefixes
        : [prefixes]
      : undefined;

    if (mode === "local") {
      throw new Error(
        '"local" cannot be used as a mode name because it conflicts with the .local postfix for .env files.',
      );
    }

    const envFiles = this.getEnvFilePaths(mode, envDir);
    const env: Record<string, string> = {};

    // Load all env files
    envFiles.forEach((filePath) => {
      try {
        loadEnvFile(filePath);
      } catch {
        // Skip if file doesn't exist
      }
    });

    // If prefixes are specified, filter environment variables
    if (normalizedPrefixes?.length) {
      for (const [key, value] of Object.entries(process.env)) {
        if (normalizedPrefixes.some((prefix) => key.startsWith(prefix))) {
          env[key] = value as string;
        }
      }
      return env;
    }

    // Return all environment variables if no prefixes specified
    return { ...process.env } as Record<string, string>;
  }
}
