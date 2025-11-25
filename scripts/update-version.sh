#!/bin/bash

# Version Update Script for tsichart-core
# This script updates the version in package.json
# Usage: ./scripts/update-version.sh [version|patch|minor|major|beta|alpha|rc]
#
# Examples:
#   ./scripts/update-version.sh 2.0.0        # Set specific version
#   ./scripts/update-version.sh patch        # 2.0.0 -> 2.0.1
#   ./scripts/update-version.sh minor        # 2.0.0 -> 2.1.0
#   ./scripts/update-version.sh major        # 2.0.0 -> 3.0.0
#   ./scripts/update-version.sh beta         # 2.0.1 -> 2.0.2-beta.0 (or 2.0.1-beta.0 -> 2.0.1-beta.1)
#   ./scripts/update-version.sh alpha        # 2.0.1 -> 2.0.2-alpha.0
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
    echo "Usage: $0 [version|patch|minor|major|beta|alpha|rc]"
    echo ""
    echo "Examples:"
    echo "  $0 2.0.0        # Set specific version"
    echo "  $0 patch        # Bump patch version"
    echo "  $0 minor        # Bump minor version"
    echo "  $0 major        # Bump major version"
    echo "  $0 beta         # Create/bump beta pre-release"
    echo "  $0 alpha        # Create/bump alpha pre-release"
    echo "  $0 rc           # Create/bump release candidate"
    echo "  $0 2.1.0-beta.2 # Set specific pre-release"
    exit 1
fi

cd "$PACKAGE_DIR"

CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"

# Function to update version in package.json
update_package_version() {
    local new_version=$1
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        pkg.version = '$new_version';
        fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
    "
}

# Function to bump version using basic semver logic
calculate_version() {
    local current=$1
    local bump_type=$2
    
    # Parse current version
    if [[ "$current" =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)(-(.+))?$ ]]; then
        local major="${BASH_REMATCH[1]}"
        local minor="${BASH_REMATCH[2]}"
        local patch="${BASH_REMATCH[3]}"
        local prerelease="${BASH_REMATCH[5]}"
        
        case "$bump_type" in
            patch)
                echo "$major.$minor.$((patch + 1))"
                ;;
            minor)
                echo "$major.$((minor + 1)).0"
                ;;
            major)
                echo "$((major + 1)).0.0"
                ;;
            beta|alpha|rc)
                if [ -n "$prerelease" ]; then
                    # Already a pre-release, increment the number
                    if [[ "$prerelease" =~ ^([a-z]+)\.([0-9]+)$ ]]; then
                        local pre_type="${BASH_REMATCH[1]}"
                        local pre_num="${BASH_REMATCH[2]}"
                        echo "$major.$minor.$patch-$bump_type.$((pre_num + 1))"
                    else
                        echo "$major.$minor.$patch-$bump_type.0"
                    fi
                else
                    # Not a pre-release, create pre-patch (bump patch and add pre-release)
                    echo "$major.$minor.$((patch + 1))-$bump_type.0"
                fi
                ;;
        esac
    else
        echo ""
    fi
}

# Calculate or set new version
if [[ "$VERSION_ARG" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]]; then
    # Specific version provided
    NEW_VERSION="$VERSION_ARG"
    echo -e "${YELLOW}Setting version to: ${NEW_VERSION}${NC}"
else
    # Calculate semver bump
    case "$VERSION_ARG" in
        beta|alpha|rc)
            echo -e "${YELLOW}Creating ${VERSION_ARG} pre-release...${NC}"
            NEW_VERSION=$(calculate_version "$CURRENT_VERSION" "$VERSION_ARG")
            ;;
        patch|minor|major)
            echo -e "${YELLOW}Bumping ${VERSION_ARG} version...${NC}"
            NEW_VERSION=$(calculate_version "$CURRENT_VERSION" "$VERSION_ARG")
            ;;
        *)
            echo -e "${RED}❌ Error: Invalid version argument: $VERSION_ARG${NC}"
            exit 1
            ;;
    esac
    
    if [ -z "$NEW_VERSION" ]; then
        echo -e "${RED}❌ Error: Failed to calculate new version${NC}"
        exit 1
    fi
fi

# Update the version
update_package_version "$NEW_VERSION"

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
