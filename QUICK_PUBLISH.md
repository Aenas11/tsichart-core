# Quick Publish Commands

## Option 1: Manual Publishing

```bash
# 1. Login to npm (one-time setup)
npm login

# 2. Navigate to core package
cd packages/core

# 3. Verify everything is ready
npm test        # Run tests
npm run build   # Build package
npm pack --dry-run  # Preview what will be published

# 4. Publish
npm publish --access public
```

## Option 2: Automated Publishing via GitHub Actions

```bash
# 1. Ensure NPM_TOKEN is set in GitHub secrets
# Go to: https://github.com/Aenas11/tsichart-core/settings/secrets/actions

# 2. Tag the release
git tag v2.0.0

# 3. Push the tag
git push origin v2.0.0

# GitHub Actions will automatically:
# - Install dependencies
# - Run tests
# - Build packages
# - Publish to npm
```

## Verify Publication

```bash
# Check package info
npm view @tsichart/core

# Install in a test project
npm install @tsichart/core

# Or use npx
npx create-react-app my-test-app
cd my-test-app
npm install @tsichart/core
```

## Test Local Package Before Publishing

```bash
cd packages/core

# Create tarball
npm pack
# Creates: tsichart-core-2.0.0.tgz

# Test install from tarball
cd /tmp/test-project
npm init -y
npm install /workspaces/TSIClient/packages/core/tsichart-core-2.0.0.tgz

# Test the import
node
> const { UXClient } = require('@tsichart/core');
> console.log(UXClient);
```

## Pre-Publish Checklist

- [ ] Tests passing: `pnpm test`
- [ ] Build successful: `pnpm build`
- [ ] Version correct in `package.json`
- [ ] CHANGELOG.md updated
- [ ] README.md accurate
- [ ] LICENSE file included
- [ ] npm authenticated

## Common Issues

**"You must be logged in to publish packages"**
```bash
npm login
# Or set token: export NODE_AUTH_TOKEN=your_token
```

**"Package name too similar to existing package"**
```bash
# Check if name is available
npm view @tsichart/core
# If taken, choose different name
```

**"Version 2.0.0 already published"**
```bash
# Cannot republish same version
# Bump version:
npm version patch  # 2.0.0 -> 2.0.1
```

## Current Package Status

- **Name**: @tsichart/core
- **Version**: 2.0.0
- **Status**: Ready to publish
- **Tests**: 114 (109 passing, 5 skipped)
- **Coverage**: 6.07%
- **Build**: ✅ Successful
