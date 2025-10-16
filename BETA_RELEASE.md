# 🚀 Quick Start: Beta Release

## Publishing @tsichart/core@2.0.0-beta.1

### Current Configuration
- ✅ **Version**: Changed to `2.0.0-beta.1`
- ✅ **Workflow**: Updated to automatically detect and use `beta` tag
- ✅ **CHANGELOG**: Updated with beta release notes

### Step-by-Step Instructions

#### 1. Commit Your Changes
```bash
cd /workspaces/TSIClient

# Check what files changed
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "chore: prepare v2.0.0-beta.1 release with automated testing"
```

#### 2. Push Changes to GitHub
```bash
# Push to your branch
git push origin refactor/monorepo-structure
```

#### 3. Create and Push Beta Tag
```bash
# Create annotated tag for beta release
git tag -a v2.0.0-beta.1 -m "Beta release v2.0.0-beta.1 - Testing infrastructure and monorepo restructure"

# Push the tag to trigger GitHub Actions
git push origin v2.0.0-beta.1
```

#### 4. Monitor GitHub Actions
After pushing the tag, GitHub Actions will automatically:
1. ✅ Checkout code
2. ✅ Install pnpm and dependencies
3. ✅ Run all 114 tests
4. ✅ Build the package
5. ✅ Detect version contains "beta"
6. ✅ Publish to npm with `--tag beta`

**Monitor the workflow:**
- Go to: https://github.com/Aenas11/tsichart-core/actions
- Watch the "Publish Package" workflow
- Should complete in ~2-3 minutes

#### 5. Verify Publication
```bash
# Check the package was published
npm view @tsichart/core

# Check beta tag specifically
npm view @tsichart/core@beta

# Check all versions
npm view @tsichart/core versions

# Check dist-tags
npm dist-tag ls @tsichart/core
```

Expected output:
```
beta: 2.0.0-beta.1
```

#### 6. Test Beta Installation
```bash
# Install the beta version
npm install @tsichart/core@beta

# Or install specific version
npm install @tsichart/core@2.0.0-beta.1

# Test in Node.js
node -e "const { UXClient } = require('@tsichart/core'); console.log('✅ Beta package loaded successfully');"
```

---

## What Happens with Beta Tag?

### For Beta Releases:
- ✅ Published to npm as `@tsichart/core@2.0.0-beta.1`
- ✅ Tagged as `beta` (not `latest`)
- ✅ Users must explicitly install with `@beta` or `@2.0.0-beta.1`
- ✅ Won't be installed by default with `npm install @tsichart/core`
- ✅ Safe for testing without affecting production users

### To Install Beta:
```bash
# Users must explicitly request beta
npm install @tsichart/core@beta
npm install @tsichart/core@2.0.0-beta.1
```

### To Install Latest (after you publish v2.0.0):
```bash
# Default install gets latest stable
npm install @tsichart/core
```

---

## After Beta Testing

Once you're satisfied with the beta:

### Option A: Publish Final v2.0.0
```bash
# 1. Update version in package.json
cd packages/core
npm version 2.0.0

# 2. Update CHANGELOG.md (change beta.1 to 2.0.0)

# 3. Commit and tag
git add .
git commit -m "chore: release v2.0.0"
git tag v2.0.0
git push origin refactor/monorepo-structure
git push origin v2.0.0
```

### Option B: Release Another Beta
```bash
# 1. Update version
cd packages/core
npm version 2.0.0-beta.2

# 2. Update CHANGELOG.md

# 3. Commit and tag
git add .
git commit -m "chore: release v2.0.0-beta.2"
git tag v2.0.0-beta.2
git push origin refactor/monorepo-structure
git push origin v2.0.0-beta.2
```

---

## ⚠️ Important: NPM_TOKEN Secret

Make sure you have the NPM_TOKEN secret configured in GitHub:

1. Generate npm access token:
   ```bash
   npm login
   npm token create
   ```

2. Add to GitHub:
   - Go to: https://github.com/Aenas11/tsichart-core/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: (paste your npm token)
   - Click "Add secret"

---

## Troubleshooting

### "NPM_TOKEN secret not found"
- Add the secret to GitHub repository settings (see above)

### "Version 2.0.0-beta.1 already exists"
- You can't republish the same version
- Bump to beta.2: `npm version 2.0.0-beta.2`

### "Tests failed"
- The workflow will stop before publishing
- Fix the tests and try again

### "Tag already exists"
- Delete local tag: `git tag -d v2.0.0-beta.1`
- Delete remote tag: `git push --delete origin v2.0.0-beta.1`
- Create new tag after fixing issues

---

## Summary

**To publish the beta right now:**

```bash
cd /workspaces/TSIClient
git add .
git commit -m "chore: prepare v2.0.0-beta.1 release"
git push origin refactor/monorepo-structure
git tag -a v2.0.0-beta.1 -m "Beta release v2.0.0-beta.1"
git push origin v2.0.0-beta.1
```

Then watch: https://github.com/Aenas11/tsichart-core/actions

🎉 That's it! GitHub Actions will handle the rest.
