import { promises as fs } from "node:fs";
import { join } from "node:path";

/**
 * Cached file system operations to improve performance by avoiding redundant I/O.
 *
 * This utility provides caching for common file system operations like checking
 * if files/directories exist, reducing the number of actual filesystem calls.
 *
 * @example
 * ```typescript
 * const fsCache = new FileSystemCache();
 *
 * // First call hits the filesystem
 * const exists1 = await fsCache.exists('/path/to/file');
 *
 * // Second call returns cached result
 * const exists2 = await fsCache.exists('/path/to/file');
 * ```
 */
export class FileSystemCache {
  private existsCache = new Map<string, boolean>();

  private isDirectoryCache = new Map<string, boolean>();

  /**
   * Checks if a file or directory exists (with caching)
   *
   * @param filePath - The path to check
   * @returns Promise resolving to true if the path exists, false otherwise
   *
   * @example
   * ```typescript
   * const exists = await fsCache.exists('/path/to/package.json');
   * if (exists) {
   *   // File exists
   * }
   * ```
   */
  async exists(filePath: string): Promise<boolean> {
    if (this.existsCache.has(filePath)) {
      return this.existsCache.get(filePath)!;
    }

    try {
      await fs.access(filePath);
      this.existsCache.set(filePath, true);
      return true;
    } catch {
      this.existsCache.set(filePath, false);
      return false;
    }
  }

  /**
   * Synchronous version of exists for compatibility with existing code
   *
   * @param filePath - The path to check
   * @returns true if the path exists, false otherwise
   *
   * @deprecated Use async `exists()` method instead for better performance
   */
  existsSync(filePath: string): boolean {
    if (this.existsCache.has(filePath)) {
      return this.existsCache.get(filePath)!;
    }

    const fsSync = require("node:fs");

    try {
      fsSync.accessSync(filePath);
      this.existsCache.set(filePath, true);
      return true;
    } catch {
      this.existsCache.set(filePath, false);
      return false;
    }
  }

  /**
   * Checks if a path is a directory (with caching)
   *
   * @param filePath - The path to check
   * @returns Promise resolving to true if the path is a directory, false otherwise
   */
  async isDirectory(filePath: string): Promise<boolean> {
    if (this.isDirectoryCache.has(filePath)) {
      return this.isDirectoryCache.get(filePath)!;
    }

    try {
      const stats = await fs.stat(filePath);
      const isDir = stats.isDirectory();
      this.isDirectoryCache.set(filePath, isDir);
      return isDir;
    } catch {
      this.isDirectoryCache.set(filePath, false);
      return false;
    }
  }

  /**
   * Finds the first existing file from a list of paths
   *
   * @param paths - Array of paths to check
   * @returns Promise resolving to the first existing path, or undefined if none exist
   *
   * @example
   * ```typescript
   * const configPath = await fsCache.findFirst([
   *   'webpack.config.js',
   *   'webpack.config.ts',
   *   '.webpack/webpack.config.js'
   * ]);
   * ```
   */
  async findFirst(paths: string[]): Promise<string | undefined> {
    const results = await Promise.allSettled(
      paths.map(async (filePath) => {
        const exists = await this.exists(filePath);
        if (exists) {
          return filePath;
        }
        throw new Error("Not found");
      }),
    );

    const found = results.find((r) => r.status === "fulfilled");
    return found?.status === "fulfilled" ? found.value : undefined;
  }

  /**
   * Checks if a package exists in node_modules (with caching)
   *
   * @param packageName - The package name to look for
   * @param startDir - Directory to start searching from (defaults to __dirname)
   * @returns Promise resolving to true if package exists, false otherwise
   *
   * @example
   * ```typescript
   * const hasWebpack = await fsCache.packageExists('webpack');
   * ```
   */
  async packageExists(packageName: string, startDir: string = __dirname): Promise<boolean> {
    const cacheKey = `pkg:${packageName}:${startDir}`;

    if (this.existsCache.has(cacheKey)) {
      return this.existsCache.get(cacheKey)!;
    }

    let dir = startDir;
    let found = false;

    // Check up the directory tree
    do {
      const packagePath = join(dir, "node_modules", packageName);

      if (await this.isDirectory(packagePath)) {
        found = true;
        break;
      }
    } while (dir !== (dir = join(dir, "..")));

    // Also check global paths
    if (!found) {
      const module = require("node:module");

      for (const globalPath of module.globalPaths) {
        const packagePath = join(globalPath, packageName);

        if (await this.isDirectory(packagePath)) {
          found = true;
          break;
        }
      }
    }

    this.existsCache.set(cacheKey, found);
    return found;
  }

  /**
   * Invalidates a specific cache entry
   *
   * @param filePath - The path to invalidate from cache
   *
   * @example
   * ```typescript
   * // After modifying a file, invalidate its cache
   * fsCache.invalidate('/path/to/modified-file.js');
   * ```
   */
  invalidate(filePath: string): void {
    this.existsCache.delete(filePath);
    this.isDirectoryCache.delete(filePath);
  }

  /**
   * Clears all cached data
   *
   * @example
   * ```typescript
   * // Clear cache after significant filesystem changes
   * fsCache.clear();
   * ```
   */
  clear(): void {
    this.existsCache.clear();
    this.isDirectoryCache.clear();
  }

  /**
   * Gets cache statistics for monitoring and debugging
   *
   * @returns Object containing cache size information
   */
  getStats(): { existsCacheSize: number; isDirectoryCacheSize: number } {
    return {
      existsCacheSize: this.existsCache.size,
      isDirectoryCacheSize: this.isDirectoryCache.size,
    };
  }
}

/**
 * Singleton instance for global use
 */
export const fsCache = new FileSystemCache();
