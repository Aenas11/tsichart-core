# Quick Start - Testing tsichart-core Imports

This test project verifies that all `tsichart-core` imports work correctly without requiring `/dist` in the import path.

## ⚡ Quick Test

```bash
# From the root of the project
cd /workspaces/TSIClient

# 1. Build the package
npm run build

# 2. Run the tests
cd test-import
npm run install-local
npm test
```

## ✅ Expected Result

```
Total Tests: 27
✅ Passed: 27
❌ Failed: 0

🎉 All tests passed! Package is configured correctly.
```

## 📝 What Gets Tested

All individual component imports work **without** `/dist`:

```javascript
✅ import LineChart from 'tsichart-core/LineChart'
✅ import HierarchyNavigation from 'tsichart-core/HierarchyNavigation'
✅ import DateTimePicker from 'tsichart-core/DateTimePicker'
✅ import Utils from 'tsichart-core/Utils'
// ... and 23 more components
```

Imports **with** `/dist` correctly fail:

```javascript
❌ import LineChart from 'tsichart-core/dist/LineChart'
```

## 🔍 How It Works

The `package.json` uses wildcard exports:

```json
{
  "exports": {
    "./*": {
      "types": "./dist/*.d.ts",
      "import": "./dist/*.js",
      "default": "./dist/*.js"
    }
  }
}
```

This automatically maps clean imports to the dist folder without users needing to include `dist/` in their import paths.

## 📚 More Info

See the full [README.md](README.md) for detailed documentation.
