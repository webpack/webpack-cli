#!/bin/bash
# Internal Fork Setup Script
# Sets up this repository as a private internal fork with proper remotes

set -e

echo "========================================="
echo "Internal Webpack-CLI Fork Setup"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if upstream remote exists
if git remote | grep -q "^upstream$"; then
    echo -e "${YELLOW}Upstream remote already exists${NC}"
else
    echo -e "${GREEN}Adding upstream remote...${NC}"
    git remote add upstream https://github.com/webpack/webpack-cli.git
    git fetch upstream
    echo -e "${GREEN}✓ Upstream remote added${NC}"
fi

# Create internal docs directory
if [ ! -d "docs/internal" ]; then
    echo -e "${GREEN}Creating internal docs directory...${NC}"
    mkdir -p docs/internal

    # Move phase documentation
    if [ -f "PHASE_2_COMPLETE.md" ]; then
        mv PHASE_*.md docs/internal/ 2>/dev/null || true
    fi

    if [ -f "REFACTORING_PLAN.md" ]; then
        mv REFACTORING_PLAN.md docs/internal/ 2>/dev/null || true
    fi

    if [ -f "SECURITY_ENHANCEMENTS.md" ]; then
        cp SECURITY_ENHANCEMENTS.md docs/internal/ 2>/dev/null || true
    fi

    echo -e "${GREEN}✓ Internal docs organized${NC}"
fi

# Create .github directory if it doesn't exist
if [ ! -d ".github" ]; then
    mkdir -p .github
fi

# Create CODEOWNERS if it doesn't exist
if [ ! -f ".github/CODEOWNERS" ]; then
    echo -e "${GREEN}Creating CODEOWNERS file...${NC}"
    cat > .github/CODEOWNERS << 'EOF'
# Code Owners for Internal Fork
# These owners will be requested for review when someone opens a pull request

# Security-critical files
/packages/webpack-cli/src/utils/validators.ts @security-team
/packages/webpack-cli/src/utils/dynamic-import-loader.ts @security-team
SECURITY*.md @security-team

# Core architecture
/packages/webpack-cli/src/core/ @architecture-team

# Build configuration
/eslint.config.mjs @build-team
/tsconfig*.json @build-team

# Documentation
/docs/internal/ @documentation-team

# Default owners for everything else
* @maintainers
EOF
    echo -e "${GREEN}✓ CODEOWNERS created${NC}"
    echo -e "${YELLOW}  Remember to update team names in .github/CODEOWNERS${NC}"
fi

# Create internal test directory
if [ ! -d "test/internal" ]; then
    echo -e "${GREEN}Creating internal test directory...${NC}"
    mkdir -p test/internal

    cat > test/internal/README.md << 'EOF'
# Internal Tests

This directory contains tests specific to our internal fork enhancements.

## Test Categories

- `security-validators.test.js` - Tests for security validators
- `manager-classes.test.js` - Tests for extracted manager classes
- `integration.test.js` - Integration tests for internal features

## Running Tests

```bash
npm run test:internal
```
EOF
    echo -e "${GREEN}✓ Internal test directory created${NC}"
fi

# Check for required dependencies
echo ""
echo -e "${GREEN}Checking dependencies...${NC}"
npm list >/dev/null 2>&1 || npm install

# Run build to ensure everything works
echo ""
echo -e "${GREEN}Building project...${NC}"
npm run build

# Run tests
echo ""
echo -e "${GREEN}Running tests...${NC}"
npm test 2>&1 | tail -20

echo ""
echo "========================================="
echo -e "${GREEN}✓ Internal fork setup complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Review NEXT_STEPS_RECOMMENDATIONS.md"
echo "2. Choose a distribution strategy"
echo "3. Update .github/CODEOWNERS with actual team names"
echo "4. Review and organize docs/internal/"
echo "5. Set up CI/CD for internal testing"
echo ""
echo "Documentation:"
echo "- INTERNAL_FORK_NOTES.md - Fork overview"
echo "- NEXT_STEPS_RECOMMENDATIONS.md - Detailed next steps"
echo "- docs/internal/ - Internal development docs"
echo ""
