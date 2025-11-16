/**
 * Centralized exit code management and graceful shutdown handler.
 *
 * This utility provides a single point of control for process exits,
 * making the codebase more testable and allowing for proper cleanup
 * before process termination.
 *
 * @example
 * ```typescript
 * // Instead of: process.exit(2)
 * ExitHandler.exit(ExitCode.CONFIGURATION_ERROR);
 *
 * // For deferred exit after current operations complete
 * ExitHandler.scheduleExit(ExitCode.WEBPACK_ERRORS);
 * ```
 */

/**
 * Standard exit codes used throughout webpack-cli
 */
export enum ExitCode {
  /** Success - no errors */
  SUCCESS = 0,

  /** Errors from webpack compilation */
  WEBPACK_ERRORS = 1,

  /** Configuration/options problem or internal error */
  CONFIGURATION_ERROR = 2,
}

/**
 * Cleanup function type for pre-exit cleanup handlers
 */
type CleanupHandler = () => void | Promise<void>;

/**
 * Manages process exit codes and provides graceful shutdown capabilities
 */
export class ExitHandler {
  private static exitCode: number = ExitCode.SUCCESS;

  private static cleanupHandlers: CleanupHandler[] = [];

  private static isExiting = false;

  /**
   * Sets the exit code without immediately exiting.
   * If multiple calls are made, the highest exit code is retained.
   *
   * @param code - The exit code to set
   */
  static setExitCode(code: number): void {
    this.exitCode = Math.max(this.exitCode, code);
  }

  /**
   * Gets the current exit code that will be used on process exit
   *
   * @returns The current exit code
   */
  static getExitCode(): number {
    return this.exitCode;
  }

  /**
   * Registers a cleanup handler to be called before process exit
   *
   * @param handler - Function to call during cleanup
   *
   * @example
   * ```typescript
   * ExitHandler.registerCleanup(() => {
   *   console.log('Cleaning up resources...');
   *   // Close connections, flush buffers, etc.
   * });
   * ```
   */
  static registerCleanup(handler: CleanupHandler): void {
    this.cleanupHandlers.push(handler);
  }

  /**
   * Runs all registered cleanup handlers
   *
   * @private
   */
  private static async runCleanup(): Promise<void> {
    if (this.isExiting) {
      return; // Prevent recursive cleanup
    }

    this.isExiting = true;

    for (const handler of this.cleanupHandlers) {
      try {
        await handler();
      } catch (error) {
        // Log but don't throw - we're exiting anyway
        console.error("[webpack-cli] Cleanup error:", error);
      }
    }
  }

  /**
   * Immediately exits the process after running cleanup handlers
   *
   * @param code - Exit code to use (defaults to stored exit code)
   */
  static async exit(code: number = this.exitCode): Promise<never> {
    this.setExitCode(code);
    await this.runCleanup();
    process.exit(this.exitCode);
  }

  /**
   * Schedules an exit after the current event loop iteration completes.
   * This allows pending async operations to finish before exiting.
   *
   * @param code - Exit code to use
   *
   * @example
   * ```typescript
   * // Allow current operations to complete
   * ExitHandler.scheduleExit(ExitCode.WEBPACK_ERRORS);
   * // Code here will still execute
   * ```
   */
  static scheduleExit(code: number): void {
    this.setExitCode(code);

    // Use setImmediate to allow current event loop to complete
    setImmediate(async () => {
      await this.exit(this.exitCode);
    });
  }

  /**
   * Resets the exit handler state (primarily for testing)
   *
   * @internal
   */
  static reset(): void {
    this.exitCode = ExitCode.SUCCESS;
    this.cleanupHandlers = [];
    this.isExiting = false;
  }
}
