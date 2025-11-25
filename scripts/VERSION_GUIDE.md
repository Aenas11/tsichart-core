# Version Management Guide

## Understanding Version and Publishing

The `tsichart-core` package uses **semantic versioning** (semver) with these components:

```
2.0.0-beta.1
│ │ │  │    └─ Pre-release identifier
│ │ │  └────── Pre-release type (beta/alpha/rc)
│ │ └──────── PATCH version (bug fixes)
│ └────────── MINOR version (new features, backwards compatible)
└──────────── MAJOR version (breaking changes)
```

### Version is Stored in `packages/core/package.json`

The version field in `package.json` is the **single source of truth**:

```json
{
  "name": "tsichart-core",
  "version": "2.0.0-beta.1",  ← This is what gets published
  ...
}
```

## How Scripts Handle Versioning

### Option 1: Scripts Manage Version (Automated)

**`release.sh`** - Bumps version automatically:

```bash
./scripts/release.sh patch
```

This script:
1. Reads current version from `package.json`
2. Calculates new version based on argument (patch/minor/major/beta)
3. Updates `package.json` with new version
4. Updates `CHANGELOG.md`
5. Commits, tags, and publishes

**When to use:** Most common releases where you want automation

---

### Option 2: You Manage Version (Manual)

**`update-version.sh`** - Only updates `package.json`:

```bash
./scripts/update-version.sh 2.0.0-beta.2
```

Then **`quick-release.sh`** - Reads existing version:

```bash
./scripts/quick-release.sh
```

This workflow:
1. You control exact version number
2. You update `CHANGELOG.md` manually  
3. `quick-release.sh` reads version from `package.json`
4. No version modification during release

**When to use:**
- You want precise version control
- You're fixing a failed release
- You need to coordinate with other changes

---

## Version to NPM Tag Mapping

The publishing scripts automatically determine the npm tag based on version:

| Version Format | NPM Tag | Install Command |
|----------------|---------|-----------------|
| `2.0.0` | `latest` | `npm install tsichart-core` |
| `2.0.0-beta.1` | `beta` | `npm install tsichart-core@beta` |
| `2.0.0-alpha.1` | `alpha` | `npm install tsichart-core@alpha` |
| `2.0.0-rc.1` | `rc` | `npm install tsichart-core@rc` |

This is handled by GitHub Actions workflow and manual publishing scripts.

---

## Common Workflows

### Workflow 1: Standard Patch Release

```bash
# Automated - script handles everything
./scripts/release.sh patch

# Version: 2.0.0 → 2.0.1
# Tag: latest
# Result: npm install tsichart-core gets 2.0.1
```

### Workflow 2: Beta Release Series

```bash
# First beta
./scripts/release.sh beta

# Version: 2.0.0 → 2.0.1-beta.0
# Tag: beta

# More betas (manual control)
./scripts/update-version.sh 2.0.1-beta.1
git add packages/core/package.json CHANGELOG.md
git commit -m "chore: bump to beta.1"
./scripts/quick-release.sh

# Result: npm install tsichart-core@beta gets latest beta
```

### Workflow 3: Controlled Pre-release

```bash
# 1. Set exact version you want
./scripts/update-version.sh 2.1.0-rc.1

# 2. Edit CHANGELOG.md with release notes

# 3. Commit
git add packages/core/package.json CHANGELOG.md
git commit -m "chore: prepare 2.1.0-rc.1 release"

# 4. Release
./scripts/quick-release.sh

# Version: 2.1.0-rc.1
# Tag: rc
# Result: npm install tsichart-core@rc
```

### Workflow 4: Fix Failed Release

If a release failed partway through:

```bash
# Version already updated in package.json
# Just re-run the release
./scripts/quick-release.sh

# It will:
# - Read existing version
# - Delete old tag if exists
# - Create new tag
# - Trigger GitHub Actions
```

---

## GitHub Actions Publishing

All release scripts **trigger GitHub Actions** by pushing a git tag:

```yaml
# .github/workflows/publishNpm.yml
on:
  push:
    tags:
      - 'v*'  # Triggers on v2.0.0, v2.0.0-beta.1, etc.
```

The workflow:
1. Reads version from `packages/core/package.json`
2. Runs tests
3. Builds package
4. Determines npm tag from version string
5. Publishes: `npm publish --tag <beta|alpha|rc|latest>`

---

## Key Takeaways

1. **Version lives in `packages/core/package.json`** - This is what gets published
2. **Git tag format is `v{version}`** - e.g., `v2.0.0-beta.1`
3. **NPM tag is auto-detected** from version string
4. **Two approaches:**
   - Automated: `release.sh` (bumps version for you)
   - Manual: `update-version.sh` + `quick-release.sh` (you control version)
5. **GitHub Actions does the publishing** - triggered by git tag push
6. **Never manually edit version without committing** - it must be in git history

---

## Troubleshooting

**Q: I want to publish the current version again**
```bash
# Delete local and remote tags
git tag -d v2.0.0-beta.1
git push tsichart-core --delete v2.0.0-beta.1

# Re-run quick release
./scripts/quick-release.sh
```

**Q: I forgot to update CHANGELOG.md**
```bash
# Edit CHANGELOG.md
vim CHANGELOG.md

# Amend the last commit
git add CHANGELOG.md
git commit --amend --no-edit

# Force push (if already pushed)
git push tsichart-core refactor/monorepo-structure --force

# Delete and recreate tag
git tag -d v2.0.0-beta.1
git push tsichart-core --delete v2.0.0-beta.1
./scripts/quick-release.sh
```

**Q: Which script should I use?**
- **Simple releases**: Use `release.sh patch|minor|major`
- **Beta testing**: Use `release.sh beta` or manual workflow
- **Precise control**: Use `update-version.sh` + `quick-release.sh`
- **Retry failed release**: Use `quick-release.sh`
