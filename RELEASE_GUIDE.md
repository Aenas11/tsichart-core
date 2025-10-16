# Release Guide - tsichart-core

This guide walks you through releasing a new version of `tsichart-core` to npm.

## Prerequisites

1. **npm Account**: You need an npm account with publish access
2. **Authentication**: Login to npm or set up an npm token
3. **Repository Access**: Push access to the GitHub repository

## Pre-Release Checklist

- [x] All tests passing (114 tests: 109 passing, 5 skipped)
- [x] Build successful (`pnpm build`)
- [x] CI/CD workflows updated with test steps
- [x] README.md is up to date
- [ ] CHANGELOG.md updated with release notes
- [ ] Version number decided (following semver)

## Release Steps

### 1. Ensure Clean State

```bash
# Make sure you're on the correct branch
git checkout refactor/monorepo-structure

# Ensure working directory is clean
git status

# Pull latest changes
git pull origin refactor/monorepo-structure
```

### 2. Update Version (if needed)

The current version in `packages/core/package.json` is `2.0.0`. If you need to update it:

```bash
cd packages/core

# For patch release (2.0.0 -> 2.0.1)
npm version patch

# For minor release (2.0.0 -> 2.1.0)
npm version minor

# For major release (2.0.0 -> 3.0.0)
npm version major

# Or set specific version
npm version 2.0.0-beta.1
```

### 3. Build and Test

```bash
# From repository root
cd /workspaces/TSIClient

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build all packages
pnpm build

# Verify core package build
ls -la packages/core/dist/
```

Expected output in `packages/core/dist/`:
- `index.js` (CommonJS)
- `index.mjs` (ES Module)
- `index.d.ts` (TypeScript definitions)
- `components/` directory
- `models/` directory
- `utils/` directory
- `styles/` directory

### 4. Test Package Locally (Optional but Recommended)

```bash
cd packages/core

# Create a tarball to inspect
npm pack

# This creates @tsichart-core-2.0.0.tgz
# You can install this in a test project:
# npm install /path/to/@tsichart-core-2.0.0.tgz
```

### 5. Authenticate with npm

**Option A: Interactive Login**
```bash
npm login
```

**Option B: Using Access Token** (recommended for CI/CD)
```bash
# Set npm token as environment variable
export NODE_AUTH_TOKEN=your_npm_token_here

# Or add to ~/.npmrc
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN" >> ~/.npmrc
```

### 6. Publish to npm

**For First Release or Pre-release:**
```bash
cd packages/core

# Publish with public access
npm publish --access public
```

**For Beta/Alpha Versions:**
```bash
# Publish with beta tag
npm publish --access public --tag beta

# Or alpha tag
npm publish --access public --tag alpha
```

**For Production Release:**
```bash
# Publish with latest tag (default)
npm publish --access public --tag latest
```

### 7. Verify Publication

```bash
# Check on npm registry
npm view tsichart-core

# Install in a test project
npm install tsichart-core
```

### 8. Create Git Tag and Release

```bash
# Tag the release
git tag -a v2.0.0 -m "Release v2.0.0"

# Push tag to GitHub
git push origin v2.0.0

# Or push all tags
git push --tags
```

### 9. Create GitHub Release

Go to https://github.com/Aenas11/tsichart-core/releases/new

- Choose the tag you just created
- Add release title: "v2.0.0 - Core Package Release"
- Add release notes (from CHANGELOG.md)
- Publish release

## Automated Publishing with GitHub Actions

The repository includes a publish workflow (`.github/workflows/publishNpm.yml`) that automatically publishes when you push a tag:

```bash
# Tag and push
git tag v2.0.0
git push origin v2.0.0
```

The workflow will:
1. ✅ Install dependencies
2. ✅ Run tests
3. ✅ Build packages
4. ✅ Publish to npm with provenance

**Setup Required:**
1. Add `NPM_TOKEN` to GitHub repository secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add new secret: `NPM_TOKEN` = your npm access token
2. Enable "Require contributors to sign off on web-based commits" if needed

## Post-Release Tasks

- [ ] Update CHANGELOG.md for next version
- [ ] Announce release (Twitter, Discord, etc.)
- [ ] Update documentation site
- [ ] Monitor npm downloads and issues
- [ ] Merge refactor branch to main (if ready)

## Troubleshooting

### "You do not have permission to publish"
- Ensure you're logged in: `npm whoami`
- Check package name isn't taken: `npm view tsichart-core`
- Verify you have access: `npm access ls-packages`

### "Package name too similar to existing package"
- Choose a different package name
- Or request transfer of the existing package

### "Version already published"
- You cannot republish the same version
- Increment version number: `npm version patch`

### Build Fails
- Check Node.js version: `node --version` (should be v22+)
- Clear caches: `pnpm store prune`
- Reinstall: `rm -rf node_modules && pnpm install`

### Tests Fail
- Run locally: `cd packages/core && npm test`
- Check for environment differences
- Review test output for specific failures

## Package Information

- **Package Name**: `tsichart-core`
- **Current Version**: `2.0.0`
- **License**: MIT
- **Repository**: https://github.com/Aenas11/tsichart-core
- **Registry**: https://www.npmjs.com/package/tsichart-core

## Versioning Strategy

Following [Semantic Versioning (semver)](https://semver.org/):

- **MAJOR** (3.0.0): Breaking changes
- **MINOR** (2.1.0): New features, backward compatible
- **PATCH** (2.0.1): Bug fixes, backward compatible
- **PRE-RELEASE** (2.0.0-beta.1): Alpha/beta releases

## Next Steps

After successfully publishing v2.0.0:

1. Monitor package analytics on npm
2. Gather user feedback
3. Plan for bug fixes or new features
4. Consider React/Vue packages in the future (if needed)
5. Continue improving test coverage (currently 6.07%)

## Support

For issues or questions:
- GitHub Issues: https://github.com/Aenas11/tsichart-core/issues
- Email: alexander.sysoev@gmail.com
