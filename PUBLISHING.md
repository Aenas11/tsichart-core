# Publishing Guide for @tsichart/core (Time Series Interactive Charts)

This guide walks you through publishing this library to npm as a generic, reusable package.

## About the Rebrand

**TSI** originally stood for "Time Series Insights" (Microsoft's deprecated service).  
**TSI** now stands for **"Time Series Interactive"** - reflecting our focus on interactive data visualization.

## Completed Changes

The following changes have been made to convert this from Microsoft's TSIClient to a generic library:

### 1. ✅ Package Configuration
- Updated `package.json` with new name, description, keywords
- Added proper npm metadata (homepage, bugs, repository)
- Configured `files` field to control what gets published
- Added `sideEffects` for better tree-shaking

### 2. ✅ Documentation
- Updated README.md with generic branding
- Removed Azure TSI deprecation notices
- Added clear installation and usage examples
- Created CHANGELOG.md
- Created CONTRIBUTING.md
- Updated LICENSE with dual copyright

### 3. ✅ Build Configuration
- Added .npmignore to exclude development files
- Existing build system (rollup + webpack) is good to go

## Steps to Publish

### Step 1: Package Name - ALREADY CHOSEN ✅

Package name: **`@tsichart/core`**

This name was chosen because:
- "TSI" rebranded as "Time Series Interactive" (not Time Series Insights)
- Scoped package allows future expansion (@tsichart/react, @tsichart/themes, etc.)
- Professional, memorable, and maintains some continuity with original name
- Short and easy to remember

**Verify availability:**
```bash
npm view @tsichart/core
# Should show "npm ERR! 404 Not Found" if available
```

### Step 2: Update All References - ALREADY DONE ✅

Files already updated with `@tsichart/core`:
- [x] `package.json` - name field
- [x] `README.md` - all import examples
- [x] `CHANGELOG.md` - package references
- [ ] `LICENSE` - add your name/organization (YOU NEED TO DO THIS)
- [ ] Any example files in `pages/examples/` (optional)

### Step 3: Set Your Metadata - YOU NEED TO DO THIS ⚠️

Update in `package.json`:
- [ ] `author`: Replace "Your Name <your.email@example.com>" with YOUR info
- [ ] `repository.url`: Replace "yourusername" with YOUR GitHub username
- [ ] `bugs.url`: Replace "yourusername" with YOUR GitHub username
- [ ] `homepage`: Replace "yourusername" with YOUR GitHub username
- [x] `version`: Already set to `1.0.0`

### Step 4: Verify Build

```bash
# Install dependencies
npm install

# Clean build
npm run clean

# Build the library
npm run build

# Verify dist/ folder contains:
# - tsiclient.js (UMD bundle)
# - tsiclient.d.ts (TypeScript definitions)
# - tsiclient.css (styles)
# - Individual component exports
```

### Step 5: Test Locally

Before publishing, test the package locally:

```bash
# Create a package tarball
npm pack

# This creates a .tgz file
# Install it in a test project:
cd /path/to/test-project
npm install /path/to/timeseries-charts-1.0.0.tgz
```

### Step 6: Create npm Account

If you don't have an npm account:

```bash
# Create account
npm adduser

# Or login
npm login
```

### Step 7: Publish to npm

```bash
# For scoped public package (free)
npm publish --access public

# For unscoped package
npm publish
```

### Step 8: Verify Publication

```bash
# Check it's available
npm view @yourscope/timeseries-charts

# Try installing it
npm install @yourscope/timeseries-charts
```

## Package Name: @tsichart/core ✅

**Chosen and implemented!**

Alternative names that were considered:
- `chronos-charts` (good fallback if @tsichart/core is taken)
- `@temporal/charts`
- `timeseries-visualizer`
- `timeline-charts`

## Pre-Publication Checklist

- [x] All Azure/TSI/Microsoft references removed from user-facing docs
- [x] TSI rebranded as "Time Series Interactive"
- [x] Package name chosen: `@tsichart/core`
- [x] Package name updated everywhere
- [ ] ⚠️ **Author information updated** (YOU NEED TO DO THIS)
- [ ] ⚠️ **Repository URL updated with your GitHub username** (YOU NEED TO DO THIS)
- [ ] Build passes successfully
- [ ] Package tested locally
- [x] README.md has clear examples
- [ ] ⚠️ **LICENSE updated with your info** (YOU NEED TO DO THIS)
- [x] Version number set to 1.0.0
- [x] .npmignore configured properly
- [x] Keywords added for discoverability

## Post-Publication

1. **Tag the release in Git:**
   ```bash
   git tag -a v1.0.0 -m "First public release"
   git push origin v1.0.0
   ```

2. **Create GitHub Release:**
   - Go to your repo's Releases page
   - Create a new release from the tag
   - Copy CHANGELOG content to release notes

3. **Set up CI/CD (optional but recommended):**
   - GitHub Actions for automated testing
   - Automated npm publishing on release

4. **Badges already added to README:**
   ```markdown
   [![npm version](https://badge.fury.io/js/%40tsichart%2Fcore.svg)](https://badge.fury.io/js/@tsichart/core)
   [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
   [![Downloads](https://img.shields.io/npm/dm/@tsichart/core.svg)](https://www.npmjs.com/package/@tsichart/core)
   ```

## Maintaining the Package

### Version Bumping

Follow semantic versioning:
- **Patch** (1.0.x): Bug fixes, no API changes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### Publishing Updates

```bash
# Update version
npm version minor

# Build
npm run build

# Publish
npm publish --access public

# Push tags
git push && git push --tags
```

## Troubleshooting

### "Package name already exists"
- Choose a different name or use a scoped package (@yourname/package)

### "You must verify your email"
- Check your email and verify your npm account

### "You do not have permission"
- Make sure you're logged in: `npm whoami`
- For scoped packages, use `--access public`

### "Files not included in package"
- Check your .npmignore file
- Verify `files` field in package.json
- Use `npm pack --dry-run` to preview

## Additional Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [npm Package Guidelines](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [TypeScript Package Publishing](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)

## Support

If you need help, you can:
- Check [npm docs](https://docs.npmjs.com/)
- Ask on [Stack Overflow](https://stackoverflow.com/questions/tagged/npm)
- Open an issue in your repository
