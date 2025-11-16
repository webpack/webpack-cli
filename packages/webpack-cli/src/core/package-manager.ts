import { resolve } from "node:path";
import { type PackageInstallOptions, type PackageManager as PackageManagerType } from "../types.js";
import { fsCache } from "../utils/file-system-cache.js";

/**
 * Options for prompting the user
 */
interface PromptOptions {
  message: string;
  defaultResponse: string;
  stream: NodeJS.WritableStream;
}

/**
 * Logger interface for package manager operations
 */
interface Logger {
  error: (message: unknown) => void;
  success: (message: string) => void;
}

/**
 * Color utility interface
 */
interface Colors {
  green: (text: string) => string;
  yellow: (text: string) => string;
}

/**
 * Manages package manager detection, selection, and package installation.
 *
 * This class provides functionality to:
 * - Detect available package managers (npm, yarn, pnpm)
 * - Determine the default package manager based on lock files
 * - Install packages interactively
 * - Check if packages exist
 *
 * @example
 * ```typescript
 * const packageManager = new PackageManager(logger, colors);
 *
 * // Get default package manager
 * const pm = packageManager.getDefault();
 *
 * // Install a package
 * await packageManager.install('webpack-bundle-analyzer');
 *
 * // Check if a package exists
 * const exists = packageManager.checkExists('webpack');
 * ```
 */
export class PackageManager {
  private defaultPackageManagerCache?: PackageManagerType;

  private availablePackageManagersCache?: PackageManagerType[];

  constructor(
    private logger: Logger,
    private colors: Colors,
  ) {}

  /**
   * Gets all available package managers installed on the system
   *
   * @returns Array of available package managers
   * @throws {Error} If no package manager is found
   *
   * @example
   * ```typescript
   * const available = packageManager.getAvailable();
   * // ['npm', 'yarn', 'pnpm']
   * ```
   */
  getAvailable(): PackageManagerType[] {
    if (this.availablePackageManagersCache) {
      return this.availablePackageManagersCache;
    }

    const { sync } = require("cross-spawn");

    const installers: PackageManagerType[] = ["npm", "yarn", "pnpm"];

    const hasPackageManagerInstalled = (pm: PackageManagerType): PackageManagerType | false => {
      try {
        sync(pm, ["--version"]);
        return pm;
      } catch {
        return false;
      }
    };

    const availableInstallers = installers.filter(
      (installer) => hasPackageManagerInstalled(installer) !== false,
    );

    if (!availableInstallers.length) {
      this.logger.error("No package manager found.");
      process.exit(2);
    }

    this.availablePackageManagersCache = availableInstallers;
    return availableInstallers;
  }

  /**
   * Determines the default package manager based on lock files and availability
   *
   * Priority order:
   * 1. package-lock.json → npm
   * 2. yarn.lock → yarn
   * 3. pnpm-lock.yaml → pnpm
   * 4. First available package manager
   *
   * @returns The default package manager, or undefined if none found
   *
   * @example
   * ```typescript
   * const pm = packageManager.getDefault();
   * console.log(pm); // 'npm' | 'yarn' | 'pnpm' | undefined
   * ```
   */
  getDefault(): PackageManagerType | undefined {
    if (this.defaultPackageManagerCache) {
      return this.defaultPackageManagerCache;
    }

    const { sync } = require("cross-spawn");

    // Check for lock files
    const hasLocalNpm = fsCache.existsSync(resolve(process.cwd(), "package-lock.json"));

    if (hasLocalNpm) {
      this.defaultPackageManagerCache = "npm";
      return "npm";
    }

    const hasLocalYarn = fsCache.existsSync(resolve(process.cwd(), "yarn.lock"));

    if (hasLocalYarn) {
      this.defaultPackageManagerCache = "yarn";
      return "yarn";
    }

    const hasLocalPnpm = fsCache.existsSync(resolve(process.cwd(), "pnpm-lock.yaml"));

    if (hasLocalPnpm) {
      this.defaultPackageManagerCache = "pnpm";
      return "pnpm";
    }

    // Fallback to checking installed package managers
    try {
      if (sync("npm", ["--version"])) {
        this.defaultPackageManagerCache = "npm";
        return "npm";
      }
    } catch {
      // Continue to next option
    }

    try {
      if (sync("yarn", ["--version"])) {
        this.defaultPackageManagerCache = "yarn";
        return "yarn";
      }
    } catch {
      // Continue to next option
    }

    try {
      if (sync("pnpm", ["--version"])) {
        this.defaultPackageManagerCache = "pnpm";
        return "pnpm";
      }
    } catch {
      this.logger.error("No package manager found.");
      process.exit(2);
    }

    return undefined;
  }

  /**
   * Checks if a package exists in node_modules
   *
   * @param packageName - The name of the package to check
   * @returns true if the package exists, false otherwise
   *
   * @example
   * ```typescript
   * const exists = packageManager.checkExists('webpack');
   * if (exists) {
   *   console.log('Webpack is installed');
   * }
   * ```
   */
  checkExists(packageName: string): boolean {
    // Handle PnP (Yarn Plug'n'Play)
    if (process.versions.pnp) {
      return true;
    }

    let dir = __dirname;

    const fs = require("node:fs");
    const path = require("node:path");

    // Search up the directory tree
    do {
      try {
        if (fs.statSync(path.join(dir, "node_modules", packageName)).isDirectory()) {
          return true;
        }
      } catch {
        // Continue searching
      }
    } while (dir !== (dir = path.dirname(dir)));

    // Check global paths
    const module = require("node:module");

    for (const internalPath of module.globalPaths) {
      try {
        if (fs.statSync(path.join(internalPath, packageName)).isDirectory()) {
          return true;
        }
      } catch {
        // Continue checking
      }
    }

    return false;
  }

  /**
   * Prompts the user for input with a default response
   *
   * @param options - Prompt configuration
   * @returns Promise resolving to true if user agrees, false otherwise
   * @private
   */
  private async prompt(options: PromptOptions): Promise<boolean> {
    const readline = require("node:readline");

    const rl = readline.createInterface({
      input: process.stdin,
      output: options.stream,
    });

    return new Promise((resolve) => {
      rl.question(`${options.message} `, (answer: string) => {
        rl.close();

        const response = (answer || options.defaultResponse).toLowerCase();

        resolve(response === "y" || response === "yes");
      });
    });
  }

  /**
   * Installs a package using the default package manager
   *
   * @param packageName - The name of the package to install
   * @param options - Installation options including pre-message callback
   * @returns Promise resolving to the installed package name
   * @throws {Error} If installation fails or user declines
   *
   * @example
   * ```typescript
   * await packageManager.install('webpack-bundle-analyzer', {
   *   preMessage: () => console.log('Installing analyzer...')
   * });
   * ```
   */
  async install(packageName: string, options: PackageInstallOptions = {}): Promise<string> {
    const packageManagerName = this.getDefault();

    if (!packageManagerName) {
      this.logger.error("Can't find package manager");
      process.exit(2);
    }

    if (options.preMessage) {
      options.preMessage();
    }

    // yarn uses 'add', npm and pnpm use 'install'
    const commandArguments = [packageManagerName === "yarn" ? "add" : "install", "-D", packageName];
    const commandToBeRun = `${packageManagerName} ${commandArguments.join(" ")}`;

    let needInstall: boolean;

    try {
      needInstall = await this.prompt({
        message: `[webpack-cli] Would you like to install '${this.colors.green(
          packageName,
        )}' package? (That will run '${this.colors.green(commandToBeRun)}') (${this.colors.yellow(
          "Y/n",
        )})`,
        defaultResponse: "Y",
        stream: process.stderr,
      });
    } catch (error) {
      this.logger.error(error);
      process.exit(error as number);
    }

    if (needInstall) {
      const { sync } = require("cross-spawn");

      try {
        sync(packageManagerName, commandArguments, { stdio: "inherit" });
      } catch (error) {
        this.logger.error(error);
        process.exit(2);
      }

      return packageName;
    }

    process.exit(2);
  }

  /**
   * Resets the package manager cache (primarily for testing)
   *
   * @internal
   */
  resetCache(): void {
    this.defaultPackageManagerCache = undefined;
    this.availablePackageManagersCache = undefined;
  }
}
