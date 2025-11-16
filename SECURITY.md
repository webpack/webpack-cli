# Security Policy

This document explains the security policy of webpack-cli and how we intend to support webpack and webpack-cli.

## Supported Versions

webpack CLI is currently supporting webpack v4 and webpack v5. Security fixes are released in patches.

| webpack version | webpack-cli version           | Supported          |
| --------------- | ----------------------------- | ------------------ |
| >= 4.20.x       | ^4.2.0                        | :white_check_mark: |
| <= 4.19.x       | ^4.2.0                        | :white_check_mark: |
| 5.x.0           | ^4.2.0                        | :white_check_mark: |
| 5.0.x           | ^4.2.0                        | :white_check_mark: |
| < 4.x.x         | (CLI included in webpack < 4) | :x:                |

**Note: Using webpack < 4 with webpack CLI is not required as CLI was [included](https://github.com/webpack/webpack/commit/4b0332d3909eea8115d84f9a03da2d52478daa70#diff-b9cfc7f2cdf78a7f4b91a753d10865a2) in webpack.**

## Reporting a Vulnerability

### Responsible Disclosure

We take security vulnerabilities seriously. If you discover a security vulnerability, please help us protect our users by following responsible disclosure practices.

**Please DO NOT:**

- Open public GitHub issues for security vulnerabilities
- Disclose the vulnerability publicly before we've had a chance to address it
- Exploit the vulnerability beyond what is necessary to demonstrate it

**Please DO:**

- Contact us privately via email (see contact information below)
- Provide detailed information about the vulnerability
- Give us reasonable time to respond and fix the issue (we aim for 90 days)
- Work with us to understand and resolve the issue

### Contact Information

To report a vulnerability, please contact one of the webpack maintainers through:

1. **Email:** Security-related issues should be sent to the maintainers via the email addresses listed on npm or GitHub profiles
2. **GitHub Security Advisories:** Use GitHub's [private vulnerability reporting](https://github.com/webpack/webpack-cli/security/advisories/new) feature
3. **Direct Message:** Reach out to maintainers on social media platforms (Twitter, Discord) for initial contact

### What to Include in Your Report

Please include as much of the following information as possible:

- Type of vulnerability (e.g., code injection, path traversal, etc.)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability (what an attacker could achieve)
- Suggested fix (if you have one)

### Response Timeline

- **Initial Response:** Within 48 hours of report
- **Vulnerability Assessment:** Within 7 days
- **Fix Development:** Depends on severity and complexity
- **Security Release:** Coordinated with reporter

## Security Measures

webpack-cli implements several security measures to protect users:

### 1. Input Validation

- All user-provided file paths are validated and sanitized
- Configuration files are loaded with proper security checks
- Command-line arguments are validated before processing

### 2. Dependency Management

- We use [Dependabot](https://github.com/dependabot) to monitor dependencies for known vulnerabilities
- Regular dependency updates to incorporate security fixes
- Automated security scanning in CI/CD pipeline

### 3. Code Security

- No use of `eval()` or `Function()` constructor for arbitrary code execution
- Dynamic imports use proper URL validation via `pathToFileURL`
- Safe handling of external module loading

### 4. Recent Security Improvements (v6.x)

- **Enhanced dynamic import security:** Removed `Function()` constructor usage in favor of native `import()` with proper path validation
- **Path traversal protection:** Added validation to prevent `../` path traversal attacks
- **Centralized exit handling:** Improved error handling and process cleanup
- **Input sanitization:** Enhanced validation for all user inputs

## Security Best Practices for Users

When using webpack-cli, follow these security best practices:

### 1. Configuration Files

```javascript
// ✅ GOOD: Use explicit, validated paths
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
};

// ❌ BAD: Avoid user-controlled paths without validation
module.exports = {
  entry: process.env.ENTRY_FILE, // Potentially unsafe
};
```

### 2. Package Installation

- Always review packages before installation when prompted by webpack-cli
- Use lock files (package-lock.json, yarn.lock, pnpm-lock.yaml) to ensure consistent dependencies
- Regularly audit your dependencies with `npm audit` or equivalent

### 3. Custom Loaders and Plugins

- Only use loaders and plugins from trusted sources
- Review the code of third-party loaders before use
- Keep all loaders and plugins updated

### 4. Environment Variables

```javascript
// ✅ GOOD: Validate environment variables
const nodeEnv = process.env.NODE_ENV;
if (!["development", "production", "test"].includes(nodeEnv)) {
  throw new Error("Invalid NODE_ENV");
}

// ❌ BAD: Direct use without validation
const config = require(process.env.CONFIG_PATH); // Dangerous!
```

### 5. File System Operations

- Never allow user input to directly control file paths
- Always use `path.resolve()` or `path.join()` to construct file paths
- Validate that resolved paths are within expected directories

## Known Security Considerations

### Dynamic Imports

webpack-cli uses dynamic imports to support various module formats (CommonJS, ESM, TypeScript, etc.). While we've implemented security measures:

- All paths are validated using Node.js `pathToFileURL`
- Input validation prevents path traversal
- Only file:// protocol URLs are supported

### Package Manager Detection

webpack-cli automatically detects and uses your package manager (npm, yarn, pnpm):

- Detection is based on lock files and availability
- No arbitrary command execution
- User confirmation required before package installation

### Configuration Loading

webpack-cli loads configuration files using rechoir/interpret:

- TypeScript and other formats require additional dependencies
- These loaders are executed in the same context as webpack-cli
- Only use configuration files from trusted sources

## Dependency Security

We regularly monitor and update our dependencies. Our key dependencies include:

- **commander:** CLI argument parsing
- **webpack:** Bundler (peer dependency)
- **rechoir:** Multi-format file loader
- **cross-spawn:** Cross-platform process spawning

All dependencies are:

- Automatically scanned by Dependabot
- Reviewed before major version updates
- Kept up-to-date with security patches

## Security Changelog

### v6.0.0+ (Current)

- ✅ Removed `Function()` constructor from dynamic imports
- ✅ Added path validation for all file operations
- ✅ Implemented centralized exit handling
- ✅ Enhanced JSDoc documentation for security-critical methods

### v5.x

- ✅ Added support for Yarn PnP
- ✅ Improved package detection security

### v4.x

- ✅ Introduced proper error handling
- ✅ Added input validation for CLI arguments

## Third-Party Security Vulnerabilities

If you discover a security vulnerability in one of our dependencies:

1. Check if it's already reported on npm advisory database
2. Submit an issue or Pull Request with the fix
3. We'll prioritize updating the vulnerable dependency

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security Advisories](https://www.npmjs.com/advisories)
- [Webpack Security Best Practices](https://webpack.js.org/configuration/other-options/#security)

## Acknowledgments

We appreciate the security researchers and users who have responsibly disclosed vulnerabilities to us. Security contributors will be acknowledged (with permission) in our release notes and security advisories.

---

**Last Updated:** 2025-01-16

For general questions about security, please open a public GitHub issue (for non-sensitive topics) or contact the maintainers directly for sensitive matters.
