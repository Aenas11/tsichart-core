#!/bin/bash

# Release Script for tsichart-core
# This script automates the process of releasing a new version to npm
# Usage: ./scripts/release.sh [beta|patch|minor|major|<specific-version>]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Remote name (can be 'origin' or 'tsichart-core')
REMOTE="tsichart-core"
BRANCH="refactor/monorepo-structure"

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "packages/core" ]; then
    print_error "This script must be run from the repository root"
    exit 1
fi

# Get release type from argument
RELEASE_TYPE="${1:-patch}"

print_header "TSIChart Release Script"

print_info "Release type: ${RELEASE_TYPE}"
print_info "Remote: ${REMOTE}"
print_info "Branch: ${BRANCH}"

# Step 1: Check working directory is clean
print_header "Step 1: Checking Git Status"

if [ -n "$(git status --porcelain)" ]; then
    print_warning "Working directory has uncommitted changes"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " COMMIT_MSG
        git add -A
        git commit -m "$COMMIT_MSG"
        print_success "Changes committed"
    else
        print_error "Please commit or stash your changes before releasing"
        exit 1
    fi
else
    print_success "Working directory is clean"
fi

# Step 2: Update version in package.json
print_header "Step 2: Updating Version"

cd packages/core

CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: ${CURRENT_VERSION}"

# Update version based on release type
if [[ "$RELEASE_TYPE" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-.*)?$ ]]; then
    # Specific version provided
    NEW_VERSION="$RELEASE_TYPE"
    print_info "Setting version to: ${NEW_VERSION}"
    npm version "$NEW_VERSION" --no-git-tag-version
else
    # Use npm version command for semver bump
    print_info "Bumping version (${RELEASE_TYPE})..."
    NEW_VERSION=$(npm version "$RELEASE_TYPE" --no-git-tag-version | sed 's/v//')
fi

print_success "New version: ${NEW_VERSION}"

cd ../..

# Step 3: Update CHANGELOG.md
print_header "Step 3: Updating CHANGELOG"

DATE=$(date +%Y-%m-%d)
print_info "Adding version ${NEW_VERSION} to CHANGELOG.md"

# Check if version already exists in CHANGELOG
if grep -q "\[${NEW_VERSION}\]" CHANGELOG.md; then
    print_warning "Version ${NEW_VERSION} already exists in CHANGELOG.md"
else
    # Add new version header after the first ##
    sed -i "0,/^## \[/s/^## \[/## [${NEW_VERSION}] - ${DATE}\n\n### Changes\n- Release version ${NEW_VERSION}\n\n## [/" CHANGELOG.md
    print_success "CHANGELOG.md updated"
fi

# Step 4: Run tests
print_header "Step 4: Running Tests"

print_info "Running test suite..."
if pnpm test; then
    print_success "All tests passed"
else
    print_error "Tests failed. Fix errors before releasing."
    exit 1
fi

# Step 5: Build packages
print_header "Step 5: Building Packages"

print_info "Building all packages..."
if pnpm build; then
    print_success "Build successful"
else
    print_error "Build failed"
    exit 1
fi

# Step 6: Commit version bump
print_header "Step 6: Committing Version Changes"

git add packages/core/package.json CHANGELOG.md
git commit -m "chore: release v${NEW_VERSION}"
print_success "Version changes committed"

# Step 7: Create and push tag
print_header "Step 7: Creating Git Tag"

TAG_NAME="v${NEW_VERSION}"
print_info "Creating tag: ${TAG_NAME}"

# Delete tag if it exists locally
if git tag -l | grep -q "^${TAG_NAME}$"; then
    print_warning "Tag ${TAG_NAME} already exists locally, deleting..."
    git tag -d "$TAG_NAME"
fi

# Create new tag
git tag -a "$TAG_NAME" -m "Release v${NEW_VERSION}"
print_success "Tag ${TAG_NAME} created"

# Step 8: Push to remote
print_header "Step 8: Pushing to Remote"

print_info "Pushing branch to ${REMOTE}..."
git push "$REMOTE" "$BRANCH"
print_success "Branch pushed"

# Delete remote tag if it exists
if git ls-remote --tags "$REMOTE" | grep -q "refs/tags/${TAG_NAME}$"; then
    print_warning "Tag ${TAG_NAME} exists on remote, deleting..."
    git push "$REMOTE" --delete "$TAG_NAME" || true
fi

print_info "Pushing tag ${TAG_NAME} to ${REMOTE}..."
git push "$REMOTE" "$TAG_NAME"
print_success "Tag pushed"

# Step 9: Wait for GitHub Actions or publish directly
print_header "Step 9: Publishing to npm"

echo ""
echo "Choose publishing method:"
echo "  1) Wait for GitHub Actions to publish automatically (recommended)"
echo "  2) Publish manually now"
echo "  3) Skip publishing"
echo ""
read -p "Enter choice (1-3): " -n 1 -r PUBLISH_CHOICE
echo ""

if [[ $PUBLISH_CHOICE == "1" ]]; then
    print_info "GitHub Actions will publish the package automatically"
    print_info "Monitor at: https://github.com/Aenas11/tsichart-core/actions"
    
elif [[ $PUBLISH_CHOICE == "2" ]]; then
    print_warning "Publishing manually to npm..."
    
    # Check if logged in to npm
    if ! npm whoami &> /dev/null; then
        print_error "Not logged in to npm. Run 'npm login' first."
        exit 1
    fi
    
    cd packages/core
    
    # Determine npm tag based on version
    if [[ "$NEW_VERSION" == *"beta"* ]]; then
        NPM_TAG="beta"
    elif [[ "$NEW_VERSION" == *"alpha"* ]]; then
        NPM_TAG="alpha"
    elif [[ "$NEW_VERSION" == *"rc"* ]]; then
        NPM_TAG="rc"
    else
        NPM_TAG="latest"
    fi
    
    print_info "Publishing with tag: ${NPM_TAG}"
    
    if npm publish --access public --tag "$NPM_TAG"; then
        print_success "Package published to npm"
    else
        print_error "Publishing failed"
        exit 1
    fi
    
    cd ../..
    
else
    print_warning "Skipping npm publish"
fi

# Step 10: Summary
print_header "Release Complete! 🎉"

echo ""
echo "Summary:"
echo "  Version: ${CURRENT_VERSION} → ${NEW_VERSION}"
echo "  Tag: ${TAG_NAME}"
echo "  Branch: ${BRANCH}"
echo "  Remote: ${REMOTE}"
echo ""

if [[ $PUBLISH_CHOICE == "1" ]]; then
    echo "Next steps:"
    echo "  1. Monitor GitHub Actions: https://github.com/Aenas11/tsichart-core/actions"
    echo "  2. Verify package on npm: npm view tsichart-core@${NEW_VERSION}"
    echo "  3. Create GitHub release: https://github.com/Aenas11/tsichart-core/releases/new"
elif [[ $PUBLISH_CHOICE == "2" ]]; then
    echo "Next steps:"
    echo "  1. Verify package: npm view tsichart-core@${NEW_VERSION}"
    echo "  2. Test installation: npm install tsichart-core@${NEW_VERSION}"
    echo "  3. Create GitHub release: https://github.com/Aenas11/tsichart-core/releases/new"
fi

echo ""
print_success "Release script completed successfully!"
echo ""
