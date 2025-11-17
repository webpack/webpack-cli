# Quick Start Guide - Internal Fork

## For New Team Members

### What is This?

This is a **private internal fork** of webpack-cli with enterprise-grade security enhancements. It includes:

- ✅ Professional security validators (prevents 5 attack vectors)
- ✅ Architectural improvements (5 manager classes extracted)
- ✅ Enhanced input validation throughout
- ✅ Comprehensive security documentation

### Installation (Choose One Method)

#### Method 1: Direct Git Installation (Simplest)

```bash
# Install from internal git repository
npm install git+https://your-git-server/GPTI314/webpack-cli.git#v6.0.0-internal

# Or use a specific branch
npm install git+https://your-git-server/GPTI314/webpack-cli.git#claude/pending-task-details-012H5DMqvr8EpEyfwky6d3TV
```

#### Method 2: Internal NPM Registry (If Available)

```bash
# Configure internal registry
npm config set @internal:registry https://your-internal-npm-registry.com

# Install from internal registry
npm install @internal/webpack-cli
```

#### Method 3: Local Development

```bash
# Clone the repository
git clone https://your-git-server/GPTI314/webpack-cli.git
cd webpack-cli

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link

# In your project
npm link @internal/webpack-cli
```

### What's Different from Official webpack-cli?

#### Security Enhancements

All user inputs are validated to prevent:

- **Path Traversal** - No `../` attacks
- **Command Injection** - Validated package names
- **Prototype Pollution** - Blocked dangerous keys
- **SSRF** - No access to internal services
- **Environment Injection** - Sanitized env vars

#### Architecture Improvements

Better organized code with extracted manager classes:

- `PackageManager` - Package operations
- `ConfigManager` - Config loading
- `CompilerFactory` - Compiler creation
- `CommandRegistry` - Command handling
- `HelpFormatter` - Help output

### Usage

**No changes to your existing webpack commands!** Use exactly as before:

```bash
# All normal webpack-cli commands work
webpack build
webpack serve
webpack --config webpack.config.js

# Security validation happens automatically
```

### For Developers

#### Local Development Setup

```bash
# Clone and setup
git clone https://your-git-server/GPTI314/webpack-cli.git
cd webpack-cli

# Run setup script
./scripts/setup-internal-fork.sh

# Build and test
npm run build
npm test
```

#### Making Changes

```bash
# Create feature branch
git checkout -b feature/my-enhancement

# Make changes
# ... edit files ...

# Test thoroughly
npm run build
npm test
npm run lint

# Commit and push
git add .
git commit -m "feat: my enhancement"
git push origin feature/my-enhancement
```

#### Security Validators API

If you need to use validators in your code:

```typescript
import { Validators } from "webpack-cli/lib/utils/validators";

// Validate a path
const pathResult = Validators.validatePath("/some/path", process.cwd());
if (!pathResult.valid) {
  console.error(pathResult.error);
}

// Validate package name
const pkgResult = Validators.validatePackageName("my-package");
if (!pkgResult.valid) {
  console.error(pkgResult.error);
}

// Validate configuration object
const configResult = Validators.validateConfig(userConfig);
if (!configResult.valid) {
  console.error(configResult.error);
}

// Validate URL
const urlResult = Validators.validateUrl("https://example.com");
if (!urlResult.valid) {
  console.error(urlResult.error);
}

// Validate environment variable
const envResult = Validators.validateEnvValue(process.env.MY_VAR);
if (!envResult.valid) {
  console.error(envResult.error);
}
```

### Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- path/to/test.js

# Run with coverage
npm run test:coverage

# Run internal tests (if added)
npm run test:internal
```

### Troubleshooting

#### Build Fails

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

#### Tests Fail

```bash
# Ensure on correct branch
git status

# Pull latest changes
git pull origin claude/pending-task-details-012H5DMqvr8EpEyfwky6d3TV

# Rebuild
npm run build && npm test
```

#### Validation Errors

If you encounter validation errors in your project:

1. **Path Traversal Error**: Check your config paths don't use `../`
2. **Package Name Error**: Ensure package names follow npm conventions
3. **Config Error**: Check for `__proto__`, `constructor`, `prototype` in configs
4. **URL Error**: Verify URLs use https:// and don't access internal IPs

### Getting Help

- **Documentation**: See [INTERNAL_FORK_NOTES.md](./INTERNAL_FORK_NOTES.md)
- **Next Steps**: See [NEXT_STEPS_RECOMMENDATIONS.md](./NEXT_STEPS_RECOMMENDATIONS.md)
- **Security Details**: See [SECURITY_ENHANCEMENTS.md](./SECURITY_ENHANCEMENTS.md)
- **Internal Docs**: See [docs/internal/](./docs/internal/)

### Important Reminders

⚠️ **DO NOT:**

- Push to public webpack/webpack-cli
- Share security validator implementation publicly
- Expose internal security logic
- Install from public npm registry (use internal version)

✅ **DO:**

- Use for internal projects
- Report security issues to security team
- Contribute improvements via pull requests
- Keep synchronized with upstream security fixes

### Version Information

- **Current Branch**: claude/pending-task-details-012H5DMqvr8EpEyfwky6d3TV
- **Base Version**: webpack-cli v5.x (check package.json)
- **Internal Version**: v6.0.0-internal (pending release)
- **Last Updated**: 2025-11-17

### Quick Links

- [Internal Fork Notes](./INTERNAL_FORK_NOTES.md) - Overview
- [Next Steps](./NEXT_STEPS_RECOMMENDATIONS.md) - Detailed roadmap
- [Security Enhancements](./SECURITY_ENHANCEMENTS.md) - Technical details
- [Security Policy](./SECURITY.md) - Security reporting

---

**Questions?** Contact the maintainers or open an issue in the internal repository.
