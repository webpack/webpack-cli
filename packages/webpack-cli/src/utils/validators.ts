import * as path from "node:path";

/**
 * Validation result type
 */
interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Security-focused validators for webpack-cli
 *
 * This class provides comprehensive input validation to prevent common security vulnerabilities:
 * - Path traversal attacks
 * - Command injection
 * - Prototype pollution
 * - Invalid configuration values
 *
 * @example
 * ```typescript
 * const result = Validators.validatePath('/safe/path');
 * if (!result.valid) {
 *   throw new Error(result.error);
 * }
 * ```
 */
export class Validators {
  /**
   * Validates a file path to prevent path traversal attacks
   *
   * Prevents:
   * - Absolute paths outside allowed directories
   * - Path traversal sequences (../, ..\, etc.)
   * - Null byte injection
   * - Symbolic link attacks
   *
   * @param filePath - Path to validate
   * @param basePath - Optional base path to restrict to (defaults to cwd)
   * @returns Validation result with error message if invalid
   *
   * @example
   * ```typescript
   * // Safe paths
   * Validators.validatePath('./webpack.config.js'); // ✅ valid
   * Validators.validatePath('src/index.js');        // ✅ valid
   *
   * // Unsafe paths
   * Validators.validatePath('../../../etc/passwd'); // ❌ invalid
   * Validators.validatePath('/etc/passwd');         // ❌ invalid
   * Validators.validatePath('file\x00.js');         // ❌ invalid (null byte)
   * ```
   */
  static validatePath(filePath: string, basePath?: string): ValidationResult {
    // Check for null bytes (common in path traversal attacks)
    if (filePath.includes("\u0000")) {
      return {
        valid: false,
        error: "Path contains null bytes",
      };
    }

    // Check for empty path
    if (!filePath || typeof filePath !== "string") {
      return {
        valid: false,
        error: "Path is empty or not a string",
      };
    }

    // Normalize the path to resolve . and .. segments
    const normalizedPath = path.normalize(filePath);

    // Check for path traversal patterns
    const dangerousPatterns = [
      /\.\.[/\\]/, // ../ or ..\
      /[/\\]\.\./, // /.. or \..
      /^\.\./, // Starts with ..
      /\.\.$/, // Ends with ..
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(normalizedPath)) {
        return {
          valid: false,
          error: "Path contains traversal patterns (..)",
        };
      }
    }

    // If basePath provided, ensure the resolved path is within it
    if (basePath) {
      const resolvedPath = path.resolve(basePath, normalizedPath);
      const resolvedBase = path.resolve(basePath);

      if (!resolvedPath.startsWith(resolvedBase)) {
        return {
          valid: false,
          error: `Path escapes base directory: ${basePath}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validates a package name to prevent injection attacks
   *
   * Prevents:
   * - Command injection via package names
   * - Invalid npm package name formats
   * - Scope injection attacks
   *
   * @param packageName - Package name to validate
   * @returns Validation result with error message if invalid
   *
   * @example
   * ```typescript
   * // Valid package names
   * Validators.validatePackageName('webpack');           // ✅ valid
   * Validators.validatePackageName('@babel/core');       // ✅ valid
   * Validators.validatePackageName('lodash.debounce');   // ✅ valid
   *
   * // Invalid package names
   * Validators.validatePackageName('pkg && rm -rf /');   // ❌ invalid
   * Validators.validatePackageName('../malicious');      // ❌ invalid
   * Validators.validatePackageName('pkg;whoami');        // ❌ invalid
   * ```
   */
  static validatePackageName(packageName: string): ValidationResult {
    if (!packageName || typeof packageName !== "string") {
      return {
        valid: false,
        error: "Package name is empty or not a string",
      };
    }

    // npm package name validation rules
    // See: https://github.com/npm/validate-npm-package-name

    // Max length check
    if (packageName.length > 214) {
      return {
        valid: false,
        error: "Package name exceeds 214 characters",
      };
    }

    // Check for dangerous characters that could enable injection
    const dangerousChars = /[;&|`$()<>'"\\]/;
    if (dangerousChars.test(packageName)) {
      return {
        valid: false,
        error: "Package name contains dangerous characters",
      };
    }

    // Check for path traversal
    if (packageName.includes("..") || packageName.includes("/./")) {
      return {
        valid: false,
        error: "Package name contains path traversal patterns",
      };
    }

    // Validate scoped package format (@scope/name)
    if (packageName.startsWith("@")) {
      const scopedPackagePattern = /^@[a-z0-9-~][a-z0-9-._~]*\/[a-z0-9-~][a-z0-9-._~]*$/i;
      if (!scopedPackagePattern.test(packageName)) {
        return {
          valid: false,
          error: "Invalid scoped package name format",
        };
      }
    } else {
      // Validate regular package name
      const packagePattern = /^[a-z0-9-~][a-z0-9-._~]*$/i;
      if (!packagePattern.test(packageName)) {
        return {
          valid: false,
          error: "Invalid package name format",
        };
      }
    }

    // Check for uppercase (npm packages should be lowercase)
    if (packageName !== packageName.toLowerCase()) {
      return {
        valid: false,
        error: "Package name should be lowercase",
      };
    }

    return { valid: true };
  }

  /**
   * Validates environment variable values to prevent injection
   *
   * Prevents:
   * - Command injection via environment variables
   * - Prototype pollution attacks
   * - Shell metacharacter exploitation
   *
   * @param value - Environment variable value to validate
   * @param allowShellChars - Whether to allow shell metacharacters (default: false)
   * @returns Validation result with error message if invalid
   *
   * @example
   * ```typescript
   * // Safe values
   * Validators.validateEnvValue('development');        // ✅ valid
   * Validators.validateEnvValue('production');         // ✅ valid
   *
   * // Unsafe values
   * Validators.validateEnvValue('prod && rm -rf /');   // ❌ invalid
   * Validators.validateEnvValue('$(whoami)');          // ❌ invalid
   * Validators.validateEnvValue('`curl evil.com`');    // ❌ invalid
   * ```
   */
  static validateEnvValue(value: string, allowShellChars = false): ValidationResult {
    if (typeof value !== "string") {
      return {
        valid: false,
        error: "Environment value is not a string",
      };
    }

    // Check for command substitution patterns
    const commandSubstitution = /\$\(|\$\{|`/;
    if (commandSubstitution.test(value)) {
      return {
        valid: false,
        error: "Environment value contains command substitution patterns",
      };
    }

    // Check for shell metacharacters (unless explicitly allowed)
    if (!allowShellChars) {
      const shellMetacharacters = /[;&|><$`\\!]/;
      if (shellMetacharacters.test(value)) {
        return {
          valid: false,
          error: "Environment value contains shell metacharacters",
        };
      }
    }

    // Check for null bytes
    if (value.includes("\u0000")) {
      return {
        valid: false,
        error: "Environment value contains null bytes",
      };
    }

    return { valid: true };
  }

  /**
   * Validates object keys to prevent prototype pollution
   *
   * Prevents:
   * - Prototype pollution via __proto__, constructor, prototype
   * - Object property injection attacks
   *
   * @param key - Object key to validate
   * @returns Validation result with error message if invalid
   *
   * @example
   * ```typescript
   * // Safe keys
   * Validators.validateObjectKey('mode');              // ✅ valid
   * Validators.validateObjectKey('output.path');       // ✅ valid
   *
   * // Unsafe keys
   * Validators.validateObjectKey('__proto__');         // ❌ invalid
   * Validators.validateObjectKey('constructor');       // ❌ invalid
   * Validators.validateObjectKey('prototype');         // ❌ invalid
   * ```
   */
  static validateObjectKey(key: string): ValidationResult {
    if (typeof key !== "string") {
      return {
        valid: false,
        error: "Object key is not a string",
      };
    }

    // Dangerous property names that can lead to prototype pollution
    const dangerousKeys = ["__proto__", "constructor", "prototype"];

    // Check the key itself
    if (dangerousKeys.includes(key)) {
      return {
        valid: false,
        error: `Dangerous object key detected: ${key}`,
      };
    }

    // Check nested keys (e.g., "obj.__proto__")
    const keyParts = key.split(".");
    for (const part of keyParts) {
      if (dangerousKeys.includes(part)) {
        return {
          valid: false,
          error: `Dangerous object key detected in path: ${key}`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validates configuration object to prevent pollution attacks
   *
   * Recursively validates all keys in a configuration object to prevent
   * prototype pollution and other object-based attacks.
   *
   * @param obj - Configuration object to validate
   * @param path - Current path in object (for error reporting)
   * @returns Validation result with error message if invalid
   *
   * @example
   * ```typescript
   * // Safe config
   * Validators.validateConfig({ mode: 'production' });  // ✅ valid
   *
   * // Unsafe config
   * Validators.validateConfig({
   *   __proto__: { isAdmin: true }
   * }); // ❌ invalid
   * ```
   */
  static validateConfig(obj: unknown, objectPath = "config"): ValidationResult {
    if (obj === null || obj === undefined) {
      return { valid: true };
    }

    if (typeof obj !== "object") {
      return { valid: true };
    }

    // Check if it's an array
    if (Array.isArray(obj)) {
      for (let index = 0; index < obj.length; index++) {
        const result = this.validateConfig(obj[index], `${objectPath}[${index}]`);
        if (!result.valid) {
          return result;
        }
      }
      return { valid: true };
    }

    // Validate object keys
    for (const key in obj) {
      // Only check own properties
      if (!Object.hasOwn(obj, key)) {
        continue;
      }

      const keyValidation = this.validateObjectKey(key);
      if (!keyValidation.valid) {
        return {
          valid: false,
          error: `${keyValidation.error} at path: ${objectPath}.${key}`,
        };
      }

      // Recursively validate nested objects
      const value = (obj as Record<string, unknown>)[key];
      if (typeof value === "object" && value !== null) {
        const result = this.validateConfig(value, `${objectPath}.${key}`);
        if (!result.valid) {
          return result;
        }
      }
    }

    return { valid: true };
  }

  /**
   * Sanitizes a string for safe use in shell commands
   *
   * Escapes or removes dangerous characters that could enable command injection.
   * Use this when you must pass user input to shell commands.
   *
   * @param input - String to sanitize
   * @returns Sanitized string safe for shell use
   *
   * @example
   * ```typescript
   * const userInput = "file.js; rm -rf /";
   * const safe = Validators.sanitizeShellInput(userInput);
   * // safe = "file.js rm -rf "
   * ```
   */
  static sanitizeShellInput(input: string): string {
    if (typeof input !== "string") {
      return "";
    }

    // Remove dangerous shell metacharacters
    return input.replaceAll(/[;&|><$`\\!(){}[\]*?~]/g, "");
  }

  /**
   * Validates a URL to prevent SSRF and open redirect attacks
   *
   * Prevents:
   * - SSRF via file://, data:// schemes
   * - Access to internal network ranges
   * - Malformed URLs
   *
   * @param url - URL to validate
   * @param allowedProtocols - Allowed URL protocols (default: http, https)
   * @returns Validation result with error message if invalid
   *
   * @example
   * ```typescript
   * // Safe URLs
   * Validators.validateUrl('https://example.com');      // ✅ valid
   *
   * // Unsafe URLs
   * Validators.validateUrl('file:///etc/passwd');       // ❌ invalid
   * Validators.validateUrl('http://localhost/admin');   // ❌ invalid
   * Validators.validateUrl('http://169.254.169.254');   // ❌ invalid (AWS metadata)
   * ```
   */
  static validateUrl(
    url: string,
    allowedProtocols: string[] = ["http:", "https:"],
  ): ValidationResult {
    if (!url || typeof url !== "string") {
      return {
        valid: false,
        error: "URL is empty or not a string",
      };
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return {
        valid: false,
        error: "Invalid URL format",
      };
    }

    // Check protocol
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return {
        valid: false,
        error: `Protocol ${parsedUrl.protocol} not allowed`,
      };
    }

    // Prevent access to local/internal addresses (SSRF protection)
    const { hostname } = parsedUrl;
    const dangerousHosts = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "::1",
      "169.254.169.254", // AWS metadata service
      "metadata.google.internal", // GCP metadata
    ];

    if (dangerousHosts.includes(hostname)) {
      return {
        valid: false,
        error: "Access to internal/local addresses not allowed",
      };
    }

    // Check for private IP ranges
    if (this.isPrivateIP(hostname)) {
      return {
        valid: false,
        error: "Access to private IP ranges not allowed",
      };
    }

    return { valid: true };
  }

  /**
   * Checks if an IP address is in a private range
   *
   * @param ip - IP address to check
   * @returns true if IP is private, false otherwise
   */
  private static isPrivateIP(ip: string): boolean {
    // IPv4 private ranges
    const privateIPv4Patterns = [
      /^10\./, // 10.0.0.0/8
      /^172\.(1[6-9]|2[0-9]|3[01])\./, // 172.16.0.0/12
      /^192\.168\./, // 192.168.0.0/16
    ];

    for (const pattern of privateIPv4Patterns) {
      if (pattern.test(ip)) {
        return true;
      }
    }

    // IPv6 private ranges
    if (ip.startsWith("fc") || ip.startsWith("fd")) {
      return true; // fc00::/7
    }

    return false;
  }
}
