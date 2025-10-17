#!/bin/bash

# Version Update Script for tsichart-core
# This script updates the version in package.json
# Usage: ./scripts/update-version.sh [version|patch|minor|major|beta|alpha]
#
# Examples:
#   ./scripts/update-version.sh 2.0.0        # Set specific version
#   ./scripts/update-version.sh patch        # 2.0.0 -> 2.0.1
#   ./scripts/update-version.sh minor        # 2.0.0 -> 2.1.0
#   ./scripts/update-version.sh major        # 2.0.0 -> 3.0.0
#   ./scripts/update-version.sh beta         # 2.0.0 -> 2.0.1-beta.0
#   ./scripts/update-version.sh 2.1.0-beta.2 # Set specific pre-release

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PACKAGE_DIR="packages/core"

if [ ! -d "$PACKAGE_DIR" ]; then
    echo -e "${RED}❌ Error: $PACKAGE_DIR not found${NC}"
    exit 1
fi

# Get version argument
VERSION_ARG="${1}"

if [ -z "$VERSION_ARG" ]; then
    echo -e "${RED}❌ Error: Version argument required${NC}"
    echo ""
    echo "Usage: $0 [version|patch|minor|major|beta|alpha]"
    echo ""
    echo "Examples:"
    echo "  $0 2.0.0        # Set specific version"
    echo "  $0 patch        # Bump patch version"
    echo "  $0 minor        # Bump minor version"
    echo "  $0 major        # Bump major version"
    echo "  $0 beta         # Create beta pre-release"
    echo "  $0 2.1.0-beta.2 # Set specific pre-release"
    exit 1
fi

cd "$PACKAGE_DIR"

CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"

# Update version
if [[ "$VERSION_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]]; then
    # Specific version provided
    NEW_VERSION="$VERSION_ARG"
    echo -e "${YELLOW}Setting version to: ${NEW_VERSION}${NC}"
    npm version "$NEW_VERSION" --no-git-tag-version --allow-same-version
else
    # Use npm version for semver bump
    case "$VERSION_ARG" in
        beta)
            echo -e "${YELLOW}Creating beta pre-release...${NC}"
            NEW_VERSION=$(npm version prerelease --preid=beta --no-git-tag-version | sed 's/v//')
            ;;
        alpha)
            echo -e "${YELLOW}Creating alpha pre-release...${NC}"
            NEW_VERSION=$(npm version prerelease --preid=alpha --no-git-tag-version | sed 's/v//')
            ;;
        rc)
            echo -e "${YELLOW}Creating release candidate...${NC}"
            NEW_VERSION=$(npm version prerelease --preid=rc --no-git-tag-version | sed 's/v//')
            ;;
        patch|minor|major)
            echo -e "${YELLOW}Bumping ${VERSION_ARG} version...${NC}"
            NEW_VERSION=$(npm version "$VERSION_ARG" --no-git-tag-version | sed 's/v//')
            ;;
        *)
            echo -e "${RED}❌ Error: Invalid version argument: $VERSION_ARG${NC}"
            exit 1
            ;;
    esac
fi

cd ../..

echo -e "${GREEN}✅ Version updated: ${CURRENT_VERSION} → ${NEW_VERSION}${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review the change: git diff $PACKAGE_DIR/package.json"
echo "  2. Update CHANGELOG.md with release notes"
echo "  3. Commit: git add $PACKAGE_DIR/package.json CHANGELOG.md"
echo "  4. Commit: git commit -m \"chore: bump version to $NEW_VERSION\""
echo "  5. Release: ./scripts/quick-release.sh"
echo ""
echo -e "${YELLOW}Or use the full release script:${NC}"
echo "  ./scripts/release.sh $NEW_VERSION"
echo ""
