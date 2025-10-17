# Release Scripts

This directory contains automation scripts for releasing tsichart-core packages.

## Quick Start

**For most releases, use one of these two approaches:**

### Option 1: Full Automated Release (Recommended)
```bash
# Bumps version, updates changelog, tests, builds, and publishes
./scripts/release.sh patch    # or minor, major, beta
```

### Option 2: Manual Version Control
```bash
# 1. Update version manually
./scripts/update-version.sh 2.0.0-beta.2

# 2. Update CHANGELOG.md manually

# 3. Commit changes
git add packages/core/package.json CHANGELOG.md
git commit -m "chore: bump version to 2.0.0-beta.2"

# 4. Quick release (uses existing version)
./scripts/quick-release.sh
```

---

## Scripts

### 🚀 `release.sh` - Full Automated Release

Comprehensive release script that bumps version, updates changelog, tests, builds, and publishes.

**Usage:**
```bash
./scripts/release.sh [beta|patch|minor|major|<version>]
```

**Examples:**
```bash
# Patch release (2.0.0 → 2.0.1)
./scripts/release.sh patch

# Minor release (2.0.1 → 2.1.0)
./scripts/release.sh minor

# Major release (2.1.0 → 3.0.0)
./scripts/release.sh major

# Beta release (2.0.0 → 2.0.0-beta.1)
./scripts/release.sh beta

# Specific version
./scripts/release.sh 2.1.0-rc.1
```

**What it does:**
1. ✅ Checks git status (commits changes if needed)
2. ✅ Updates version in `packages/core/package.json`
3. ✅ Updates `CHANGELOG.md` with new version
4. ✅ Runs all tests
5. ✅ Builds all packages
6. ✅ Commits version changes
7. ✅ Creates git tag
8. ✅ Pushes branch and tag to remote
9. ✅ Publishes to npm (via GitHub Actions or manually)

**Interactive Prompts:**
- Commit message (if working directory is dirty)
- Publishing method choice:
  - Wait for GitHub Actions (recommended)
  - Publish manually now
  - Skip publishing

---

### ⚡ `quick-release.sh` - Quick Release (Existing Version)

Fast release script that uses the CURRENT version in package.json without modifying it.
Perfect when you've already updated the version manually.

**Usage:**
```bash
./scripts/quick-release.sh
```

**When to use:**
- You've already updated `package.json` manually
- You want full control over version numbers
- You're fixing a release that failed partway through

**What it does:**
1. ✅ Reads existing version from `packages/core/package.json`
2. ✅ Runs tests
3. ✅ Builds packages
4. ✅ Commits any uncommitted changes (optional)
5. ✅ Creates git tag with current version
6. ✅ Pushes to GitHub (triggers automated npm publish)

**Example:**
```bash
# 1. Manually edit packages/core/package.json version to "2.0.0-beta.2"
# 2. Run quick release
$ ./scripts/quick-release.sh
📦 Current version: 2.0.0-beta.2
🏷️  NPM tag: beta
🏷️  Git tag: v2.0.0-beta.2
Release version 2.0.0-beta.2? [y/N]: y
```

---

### 📝 `update-version.sh` - Version Update Only

Updates the version in `package.json` WITHOUT releasing.
Use this when you want to prepare for a release but not publish yet.

**Usage:**
```bash
./scripts/update-version.sh [version|patch|minor|major|beta|alpha|rc]
```

**Examples:**
```bash
# Set specific version
./scripts/update-version.sh 2.0.0

# Bump patch (2.0.0 → 2.0.1)
./scripts/update-version.sh patch

# Bump minor (2.0.0 → 2.1.0)
./scripts/update-version.sh minor

# Bump major (2.0.0 → 3.0.0)
./scripts/update-version.sh major

# Create beta pre-release (2.0.0 → 2.0.1-beta.0)
./scripts/update-version.sh beta

# Set specific pre-release
./scripts/update-version.sh 2.1.0-beta.2
```

**What it does:**
- ✅ Updates version in `packages/core/package.json`
- ⚠️ Does NOT commit, tag, or publish
- ⚠️ You must manually update CHANGELOG.md
- ⚠️ You must manually commit changes

**Typical workflow:**
```bash
# 1. Update version
./scripts/update-version.sh 2.0.0-beta.2

# 2. Update CHANGELOG.md manually

# 3. Commit changes
git add packages/core/package.json CHANGELOG.md
git commit -m "chore: bump version to 2.0.0-beta.2"

# 4. Release
./scripts/quick-release.sh
```

---

### ⚡ `release-beta.sh` - Quick Beta Release (Legacy)

Simplified script for rapid beta releases during development.

**Usage:**
```bash
./scripts/release-beta.sh
```

**What it does:**
1. ✅ Auto-increments beta version (beta.1 → beta.2)
2. ✅ Runs tests
3. ✅ Builds packages
4. ✅ Commits, tags, and pushes
5. ✅ Triggers GitHub Actions for publishing

**Example Flow:**
```bash
$ ./scripts/release-beta.sh
🚀 Quick Beta Release

ℹ Current version: 2.0.0-beta.1
ℹ Suggested version: 2.0.0-beta.2
Enter version (or press Enter for suggested): [Enter]

ℹ Setting version to: 2.0.0-beta.2
ℹ Running tests...
ℹ Building...
ℹ Committing changes...
ℹ Creating tag: v2.0.0-beta.2
ℹ Pushing to remote...

✓ Beta release 2.0.0-beta.2 complete!
ℹ Monitor at: https://github.com/Aenas11/tsichart-core/actions
```

---

## Prerequisites

### Required Tools
- Node.js v22+
- pnpm v10+
- Git
- npm account with publish access (for manual publishing)

### GitHub Secrets
For automatic publishing via GitHub Actions:
- `NPM_TOKEN` must be configured in repository secrets
- Go to: https://github.com/Aenas11/tsichart-core/settings/secrets/actions

### npm Authentication
For manual publishing:
```bash
npm login
npm whoami  # Verify you're logged in
```

---

## Version Numbering

Following [Semantic Versioning (semver)](https://semver.org/):

- **MAJOR** (3.0.0): Breaking changes
- **MINOR** (2.1.0): New features, backward compatible
- **PATCH** (2.0.1): Bug fixes, backward compatible
- **BETA** (2.0.0-beta.1): Pre-release for testing
- **ALPHA** (2.0.0-alpha.1): Early pre-release
- **RC** (2.0.0-rc.1): Release candidate

---

## Publishing Methods

### Method 1: GitHub Actions (Recommended)

**Pros:**
- ✅ Automated and consistent
- ✅ Runs in clean environment
- ✅ NPM provenance enabled
- ✅ Logs available in GitHub

**How it works:**
1. Script pushes git tag (e.g., `v2.0.0`)
2. GitHub Actions workflow triggers
3. Workflow runs tests and builds
4. Package published to npm automatically

**Monitor:**
- https://github.com/Aenas11/tsichart-core/actions

### Method 2: Manual Publishing

**Pros:**
- ✅ Immediate feedback
- ✅ Full control

**Cons:**
- ❌ Must be logged in to npm
- ❌ Environment differences

**When to use:**
- Testing publishing process
- GitHub Actions unavailable
- Emergency hotfixes

---

## npm Dist Tags

The scripts automatically determine the npm dist tag based on version:

| Version Pattern | npm Tag | Install Command |
|----------------|---------|-----------------|
| `2.0.0` | `latest` | `npm install tsichart-core` |
| `2.0.0-beta.1` | `beta` | `npm install tsichart-core@beta` |
| `2.0.0-alpha.1` | `alpha` | `npm install tsichart-core@alpha` |
| `2.0.0-rc.1` | `rc` | `npm install tsichart-core@rc` |

---

## Troubleshooting

### "Tag already exists"
```bash
# Delete local and remote tag
git tag -d v2.0.0-beta.1
git push tsichart-core --delete v2.0.0-beta.1

# Run script again
./scripts/release-beta.sh
```

### "Tests failed"
```bash
# Fix test issues first
pnpm test

# Then run script
./scripts/release.sh patch
```

### "Not logged in to npm"
```bash
npm login
# Follow prompts

# Verify
npm whoami
```

### "Version already published"
```bash
# You cannot republish same version
# Increment version instead
./scripts/release-beta.sh  # Will suggest next version
```

---

## Post-Release Checklist

After successful release:

1. ✅ **Verify on npm**
   ```bash
   npm view tsichart-core@2.0.0
   ```

2. ✅ **Test installation**
   ```bash
   npm install tsichart-core@2.0.0
   ```

3. ✅ **Create GitHub Release**
   - Go to: https://github.com/Aenas11/tsichart-core/releases/new
   - Select the tag
   - Copy notes from CHANGELOG.md
   - Publish release

4. ✅ **Announce**
   - Update documentation
   - Social media posts
   - Notify users

---

## Advanced Usage

### Dry Run (Test Without Publishing)

Modify the script to skip git push and npm publish:
```bash
# Comment out push commands in release.sh
# git push "$REMOTE" "$BRANCH"
# git push "$REMOTE" "$TAG_NAME"
```

### Custom Remote Name

If your remote is named `origin` instead of `tsichart-core`:
```bash
# Edit scripts and change:
REMOTE="origin"
```

Or use git remote rename:
```bash
git remote rename tsichart-core origin
```

---

## Examples

### Scenario 1: First Beta Release
```bash
./scripts/release.sh 2.0.0-beta.1
# Choose: Wait for GitHub Actions
```

### Scenario 2: Increment Beta
```bash
./scripts/release-beta.sh
# Press Enter to accept suggested version (beta.2)
```

### Scenario 3: Final Release
```bash
./scripts/release.sh 2.0.0
# Choose: Wait for GitHub Actions
```

### Scenario 4: Hotfix
```bash
./scripts/release.sh patch
# Choose: Publish manually now
```

---

## Contributing

When modifying these scripts:
- Test in a separate branch first
- Maintain backward compatibility
- Update this README
- Add error handling for edge cases

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/Aenas11/tsichart-core/issues
- Email: alexander.sysoev@gmail.com
