#!/bin/bash
# Repository Privacy Verification Script
# Run this script to verify all privacy protections are in place

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Repository Privacy Verification${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Check 1: Pre-push hook exists and is executable
echo -n "Checking pre-push hook... "
if [ -x ".git/hooks/pre-push" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} - Pre-push hook missing or not executable"
    echo "  Fix: chmod +x .git/hooks/pre-push"
    ((FAIL++))
fi

# Check 2: README has privacy warning
echo -n "Checking README privacy warning... "
if grep -q "PRIVATE REPOSITORY" README.md; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC} - README missing privacy warning"
    ((FAIL++))
fi

# Check 3: Internal documentation exists
echo -n "Checking internal documentation... "
DOCS_MISSING=0
for doc in "INTERNAL_FORK_NOTES.md" ".github/PRIVATE_REPO_WARNING.md" ".github/SECURITY_BARRIERS.md"; do
    if [ ! -f "$doc" ]; then
        ((DOCS_MISSING++))
    fi
done

if [ $DOCS_MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} - $DOCS_MISSING documentation file(s) missing"
    ((WARN++))
fi

# Check 4: No public remotes configured
echo -n "Checking git remotes... "
PUBLIC_REMOTES=0

while IFS= read -r remote; do
    url=$(git remote get-url "$remote" 2>/dev/null || echo "")
    if [[ "$url" =~ (github\.com/(webpack|[^/]+/webpack-cli)|gitlab\.com/webpack|bitbucket\.org/webpack) ]]; then
        if [[ "$url" =~ (push) ]] || ! [[ "$url" =~ (fetch) ]]; then
            echo -e "${RED}✗ FAIL${NC} - Public push remote found: $remote ($url)"
            ((PUBLIC_REMOTES++))
            ((FAIL++))
        fi
    fi
done < <(git remote)

if [ $PUBLIC_REMOTES -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    if [ $FAIL -eq 0 ]; then
        ((PASS++))
    fi
fi

# Check 5: Origin points to internal server
echo -n "Checking origin remote... "
ORIGIN_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$ORIGIN_URL" =~ (127\.0\.0\.1|localhost|\.local|internal) ]]; then
    echo -e "${GREEN}✓ PASS${NC} - Points to internal server"
    ((PASS++))
elif [ -z "$ORIGIN_URL" ]; then
    echo -e "${YELLOW}⚠ WARNING${NC} - No origin remote configured"
    ((WARN++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Origin may not be internal: $ORIGIN_URL"
    echo "  Verify this is an approved internal repository"
    ((WARN++))
fi

# Check 6: .gitignore includes common secrets
echo -n "Checking .gitignore for secret patterns... "
if [ -f ".gitignore" ]; then
    PATTERNS=("*.key" "*.pem" ".env")
    MISSING=0
    for pattern in "${PATTERNS[@]}"; do
        if ! grep -q "$pattern" .gitignore 2>/dev/null; then
            ((MISSING++))
        fi
    done
    
    if [ $MISSING -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASS++))
    else
        echo -e "${YELLOW}⚠ WARNING${NC} - $MISSING recommended pattern(s) missing from .gitignore"
        ((WARN++))
    fi
else
    echo -e "${YELLOW}⚠ WARNING${NC} - .gitignore not found"
    ((WARN++))
fi

# Check 7: Test pre-push hook (dry run)
echo -n "Testing pre-push hook... "
if .git/hooks/pre-push origin "https://github.com/webpack/webpack-cli.git" 2>&1 | grep -q "PUSH BLOCKED\|REJECTED"; then
    echo -e "${GREEN}✓ PASS${NC} - Pre-push hook blocks public pushes"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Pre-push hook may not be working correctly"
    ((WARN++))
fi

# Summary
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Verification Results${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Passed:${NC}  $PASS"
echo -e "${YELLOW}Warnings:${NC} $WARN"
echo -e "${RED}Failed:${NC}  $FAIL"
echo ""

if [ $FAIL -gt 0 ]; then
    echo -e "${RED}⚠️  CRITICAL: Failed checks must be addressed immediately!${NC}"
    echo ""
    exit 1
elif [ $WARN -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warnings should be reviewed and addressed.${NC}"
    echo ""
    exit 0
else
    echo -e "${GREEN}✓ All privacy protections are in place!${NC}"
    echo ""
    exit 0
fi
