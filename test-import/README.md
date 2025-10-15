# tsichart-core Import Testing

This folder contains test scripts to verify that the `tsichart-core` package is correctly configured and all imports work as documented.

## Purpose

- ✅ Verify clean imports work without `/dist` in the path
- ✅ Test all component imports
- ✅ Ensure package.json exports are configured correctly
- ✅ Validate the package before publishing to npm

## Prerequisites

Before running tests, you need to build the package:

```bash
cd /workspaces/TSIClient
npm run build
```

This will create a tarball in `build_artifacts/tsichart-core-*.tgz`

## Running Tests

### Step 1: Install the local package

```bash
cd test-import
npm run install-local
```

This installs the locally built tarball from `../build_artifacts/`

### Step 2: Run the import tests

```bash
npm test
```

This runs `test-imports.mjs` which verifies:
- ✅ Main package import works
- ✅ All individual component imports work (without `/dist`)
- ✅ Utils and model imports work
- ✅ Imports with `/dist` correctly fail

### Step 3: Test basic usage patterns

```bash
node test-basic-usage.mjs
```

This demonstrates the recommended usage patterns from the README.

## What Gets Tested

### Individual Components (Tree-shakeable) ⭐ **RECOMMENDED**
```javascript
import LineChart from 'tsichart-core/LineChart';
import HierarchyNavigation from 'tsichart-core/HierarchyNavigation';
import DateTimePicker from 'tsichart-core/DateTimePicker';
// ... and all other components
```

### Main Package Import (for UMD/browser use)
```javascript
// This works better in browser/UMD contexts
import TsiClient from 'tsichart-core';
```
**Note:** For modern bundlers (webpack/vite), prefer individual component imports for better tree-shaking.

### Utilities and Models
```javascript
import Utils from 'tsichart-core/Utils';
import TsqExpression from 'tsichart-core/TsqExpression';
import AggregateExpression from 'tsichart-core/AggregateExpression';
```

## Expected Results

When everything is configured correctly:

```
✅ All imports should work WITHOUT /dist in the path
❌ Imports WITH /dist should fail (this is correct behavior)
```

**Example of CORRECT import:**
```javascript
import HierarchyNavigation from 'tsichart-core/HierarchyNavigation'; // ✅ Works
```

**Example of INCORRECT import (will fail):**
```javascript
import HierarchyNavigation from 'tsichart-core/dist/HierarchyNavigation'; // ❌ Fails
```

## Troubleshooting

### "Cannot find module" errors

If you see errors like:
```
Cannot find module 'tsichart-core/LineChart'
```

**Possible causes:**

1. **Package not built** - Run `npm run build` in the root directory
2. **Package not installed** - Run `npm run install-local` in test-import directory
3. **Exports misconfigured** - Check `package.json` exports field
4. **dist folder missing** - Ensure `files` array includes "dist" in package.json

### Verifying the package contents

To see what's actually in the installed package:

```bash
ls -la node_modules/tsichart-core/
```

You should see:
- ✅ `dist/` folder with all component files
- ✅ `tsiclient.js`
- ✅ `tsiclient.d.ts`
- ✅ `tsiclient.css`
- ✅ `package.json`

### Testing with a real bundler

For a more complete test, create a simple webpack/vite project:

```bash
# Create a new test project
mkdir bundler-test
cd bundler-test
npm init -y
npm install vite

# Install your local package
npm install ../../build_artifacts/tsichart-core-*.tgz

# Create index.html and test file
# ... import components and build
```

## CI/CD Integration

Add this to your GitHub Actions or CI pipeline:

```yaml
- name: Test package imports
  run: |
    cd test-import
    npm run install-local
    npm test
```

## Files in this directory

- **`package.json`** - Test project configuration
- **`test-imports.mjs`** - Comprehensive import tests for all components
- **`test-basic-usage.mjs`** - Basic usage examples
- **`README.md`** - This file

## Notes

- Tests run in Node.js, so CSS imports are not tested (they work in bundlers only)
- The tests verify the package exports are configured correctly
- All tests use ESM imports (`.mjs` files with `"type": "module"`)
