#!/bin/bash

# Quick Release Script for tsichart-core
# This script uses the EXISTING version in package.json and triggers GitHub Actions
# For version bumping, manually edit packages/core/package.json first or use release.sh
# 
# Usage: ./scripts/quick-release.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

REMOTE="tsichart-core"
BRANCH="refactor/monorepo-structure"
PACKAGE_DIR="packages/core"

echo -e "${BLUE}════════════════════════════════════${NC}"
echo -e "${BLUE}  Quick Release - tsichart-core${NC}"
echo -e "${BLUE}════════════════════════════════════${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "$PACKAGE_DIR" ]; then
    echo -e "${RED}❌ Error: Must run from repository root${NC}"
    exit 1
fi

# Read EXISTING version from package.json (no modification)
VERSION=$(node -p "require('./$PACKAGE_DIR/package.json').version")
if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Error: Could not read version from $PACKAGE_DIR/package.json${NC}"
    exit 1
fi

# Determine npm tag based on version
NPM_TAG="latest"
if [[ "$VERSION" == *"beta"* ]]; then
    NPM_TAG="beta"
elif [[ "$VERSION" == *"alpha"* ]]; then
    NPM_TAG="alpha"
elif [[ "$VERSION" == *"rc"* ]]; then
    NPM_TAG="rc"
fi

TAG_NAME="v$VERSION"

echo -e "${GREEN}📦 Current version: ${VERSION}${NC}"
echo -e "${BLUE}🏷️  NPM tag: ${NPM_TAG}${NC}"
echo -e "${BLUE}🏷️  Git tag: ${TAG_NAME}${NC}"
echo ""

# Confirm
read -p "$(echo -e ${YELLOW}Release version ${VERSION}? [y/N]:${NC} )" -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Cancelled${NC}"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo ""
    echo -e "${YELLOW}⚠️  Uncommitted changes:${NC}"
    git status -s
    echo ""
    read -p "$(echo -e ${YELLOW}Commit changes? [y/N]:${NC} )" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add -A
        read -p "Commit message: " COMMIT_MSG
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}✅ Committed${NC}"
    fi
fi

echo ""
echo -e "${BLUE}🧪 Running tests...${NC}"
if ! pnpm test 2>&1 | tail -5; then
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Tests passed${NC}"

echo ""
echo -e "${BLUE}🔨 Building...${NC}"
if ! pnpm build 2>&1 | tail -5; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build complete${NC}"

echo ""
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push $REMOTE $BRANCH
echo -e "${GREEN}✅ Pushed${NC}"

# Handle existing tag
if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
    echo ""
    echo -e "${YELLOW}⚠️  Tag ${TAG_NAME} exists locally${NC}"
    read -p "$(echo -e ${YELLOW}Delete and recreate? [y/N]:${NC} )" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d "$TAG_NAME"
        git push --delete $REMOTE "$TAG_NAME" 2>/dev/null || true
        echo -e "${GREEN}✅ Old tag deleted${NC}"
    else
        echo -e "${RED}❌ Cancelled${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}🏷️  Creating tag ${TAG_NAME}...${NC}"
git tag -a "$TAG_NAME" -m "Release $TAG_NAME"
echo -e "${GREEN}✅ Tag created${NC}"

echo ""
echo -e "${BLUE}📤 Pushing tag...${NC}"
git push $REMOTE "$TAG_NAME"
echo -e "${GREEN}✅ Tag pushed${NC}"

echo ""
echo -e "${GREEN}════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Release initiated!${NC}"
echo -e "${GREEN}════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}GitHub Actions will now:${NC}"
echo "  1. Run tests"
echo "  2. Build package"
echo "  3. Publish to npm with tag: $NPM_TAG"
echo ""
echo -e "${BLUE}🔗 Monitor: ${NC}https://github.com/Aenas11/tsichart-core/actions"
echo ""
echo -e "${BLUE}📦 After publishing:${NC}"
if [ "$NPM_TAG" = "latest" ]; then
    echo "   npm install tsichart-core"
else
    echo "   npm install tsichart-core@$NPM_TAG"
fi
echo ""
