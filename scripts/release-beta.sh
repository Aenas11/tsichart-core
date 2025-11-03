#!/bin/bash

# Quick Beta Release Script
# Usage: ./scripts/release-beta.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

REMOTE="tsichart-core"
BRANCH="refactor/monorepo-structure"

echo -e "${BLUE}🚀 Quick Beta Release${NC}"
echo ""

# Get current version and bump to next beta
cd packages/core
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}ℹ${NC} Current version: ${CURRENT_VERSION}"

# Suggest next beta version
if [[ "$CURRENT_VERSION" == *"beta"* ]]; then
    # Extract beta number and increment
    BETA_NUM=$(echo "$CURRENT_VERSION" | grep -oP 'beta\.\K[0-9]+')
    NEXT_BETA=$((BETA_NUM + 1))
    BASE_VERSION=$(echo "$CURRENT_VERSION" | grep -oP '^[0-9]+\.[0-9]+\.[0-9]+')
    SUGGESTED_VERSION="${BASE_VERSION}-beta.${NEXT_BETA}"
else
    # First beta version
    SUGGESTED_VERSION="${CURRENT_VERSION}-beta.1"
fi

echo -e "${BLUE}ℹ${NC} Suggested version: ${SUGGESTED_VERSION}"
read -p "Enter version (or press Enter for suggested): " NEW_VERSION
NEW_VERSION=${NEW_VERSION:-$SUGGESTED_VERSION}

echo ""
echo -e "${BLUE}ℹ${NC} Setting version to: ${NEW_VERSION}"

# Update version
npm version "$NEW_VERSION" --no-git-tag-version
cd ../..

# Run tests
echo -e "${BLUE}ℹ${NC} Running tests..."
pnpm test

# Build
echo -e "${BLUE}ℹ${NC} Building..."
pnpm build

# Commit
echo -e "${BLUE}ℹ${NC} Committing changes..."
git add packages/core/package.json
git commit -m "chore: bump version to ${NEW_VERSION}"

# Tag
TAG_NAME="v${NEW_VERSION}"
echo -e "${BLUE}ℹ${NC} Creating tag: ${TAG_NAME}"
git tag -d "$TAG_NAME" 2>/dev/null || true
git tag -a "$TAG_NAME" -m "Beta release ${NEW_VERSION}"

# Push
echo -e "${BLUE}ℹ${NC} Pushing to remote..."
git push "$REMOTE" "$BRANCH"
git push "$REMOTE" --delete "$TAG_NAME" 2>/dev/null || true
git push "$REMOTE" "$TAG_NAME"

echo ""
echo -e "${GREEN}✓${NC} Beta release ${NEW_VERSION} complete!"
echo -e "${BLUE}ℹ${NC} Monitor at: https://github.com/Aenas11/tsichart-core/actions"
echo ""
