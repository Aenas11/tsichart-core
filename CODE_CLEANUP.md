# Code Cleanup Tasks - TSI Rebrand Guide

**TSI** now stands for **Time Series Interactive** (not Time Series Insights)

This document lists specific code changes needed to make the library fully generic.

## Critical Changes (Required Before Publishing)

### 1. TSI References in Code (Optional to Update)

The library has internal references to "TSI" - these now represent **"Time Series Interactive"** rather than "Time Series Insights". Since they're internal implementation details, they don't need to be changed.

**Files with TSI references (OK to keep):**
- `src/UXClient/UXClient.ts` - Contains `transformTsxToEventsArray` and similar methods
- `__tsiError__` in error handling - represents "Time Series Interactive Error"
- CSS class names prefixed with `tsi-` - represents "Time Series Interactive" styling

### 2. Update Window Global Reference (Optional)

In `src/TsiClient.ts`, the library attaches itself to the window object:

```typescript
(<any>window).TsiClient = TsiClient;
```

**Note:** `TsiClient` now stands for "Time Series Interactive Client" so this is fine to keep.

**Optional enhancement:**
```typescript
// Keep TsiClient for backward compatibility
(<any>window).TsiClient = TsiClient;
// Add alternative for clarity
(<any>window).TimeSeriesInteractive = TsiClient;
```

### 3. Class Name Consideration

The main class is called `TsiClient`. Consider:

**Option A: Keep it (easiest)**
- Pro: No breaking changes, works immediately
- Con: Name doesn't reflect the generic nature

**Option B: Rename with alias**
```typescript
class TimeSeriesCharts {
  // ... existing code
}

// Backward compatibility
const TsiClient = TimeSeriesCharts;

export default TimeSeriesCharts;
export { TsiClient }; // for backward compatibility
```

### 4. File Naming

Current files have "tsi" in names:
- Output files: `tsiclient.js`, `tsiclient.css`, `tsiclient.d.ts`
- Source: `TsiClient.ts`

**Options:**
- Keep names (simplest, maintains compatibility)
- Rename output files in build config to `timeseries-charts.js` etc.

**Recommendation:** Keep the names for now since they're just filenames, not public API. Users import by package name anyway.

## Non-Critical Cleanup (Nice to Have)

### 5. CSS Class Prefixes

Many CSS classes use `tsi-` prefix:
- `.tsi-valueElement`
- `.tsi-splitByLabel`
- `.tsi-markerValue`
- etc.

**Recommendation:** Keep these. They're internal implementation details and changing them would be a lot of work with little benefit.

### 6. Internal Comments

Search for and update comments that reference:
- Azure Time Series Insights → Update to "Time Series Interactive"
- TSI service → OK to keep (now means "Time Series Interactive")
- Microsoft-specific implementation details → Update if user-facing

### 7. Variable Names

Some variables use TSI-related naming:
- `availabilityTsx`
- `rawBucketSize` (Azure TSI terminology)

**Recommendation:** Leave these unless they're confusing. They're internal implementation.

## Changes Already Completed ✅

- [x] Package name set to `@tsichart/core`
- [x] TSI rebranded as "Time Series Interactive" throughout docs
- [x] package.json updated with generic name and metadata
- [x] README.md rewritten for generic use
- [x] LICENSE updated with dual copyright
- [x] CHANGELOG.md created
- [x] CONTRIBUTING.md created
- [x] PUBLISHING.md guide created
- [x] .npmignore created
- [x] Removed Azure deprecation notices
- [x] All import examples updated to use @tsichart/core

## Quick Search & Replace Guide

If you want to do a comprehensive cleanup, here are safe find/replace operations:

### Safe to Replace Globally

1. In **comments only**:
   - "Azure Time Series Insights" → "Time Series"
   - "TSI" → "TS" or "Time Series" (in comments/docs only!)

### DO NOT Replace

- Class names in code (would break the library)
- CSS class names (would break styling)
- Variable names in implementation
- File names (not worth the complexity)

## Testing After Changes

If you make any code changes, test thoroughly:

```bash
# Build
npm run build

# Start dev server and check examples
npm start

# Visit http://localhost:8080/pages/examples/
```

Test these example pages to ensure nothing broke:
- `pages/examples/noauth/basiccharts.html`
- `pages/examples/noauth/availabilityAndLinechart.html`
- `pages/examples/testcases/newLinechartArch.html`

## Minimal Recommended Changes

For a quick, safe publication, you ONLY need to:

1. ✅ Package name chosen: `@tsichart/core`
2. ✅ Package name updated everywhere
3. ✅ TSI rebranded as "Time Series Interactive"
4. ✅ README.md updated with new package name
5. ⚠️  **Add your author info to package.json**
6. ⚠️  **Add your GitHub username to repository URLs in package.json**
7. ⚠️  **Add your name to LICENSE**
8. Test build: `npm run build`
9. Publish: `npm publish --access public`

Everything else is optional polish that can be done in future versions.

## Example: Minimal Changes for Publishing

Here's exactly what you need to change before publishing:

### In package.json:
```json
{
  "name": "@tsichart/core",  // ✅ ALREADY SET
  "author": "Your Name <your.email@example.com>",  // ⚠️ UPDATE THIS
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/tsichart-core"  // ⚠️ UPDATE USERNAME
  },
  "bugs": {
    "url": "https://github.com/yourusername/tsichart-core/issues"  // ⚠️ UPDATE USERNAME
  },
  "homepage": "https://github.com/yourusername/tsichart-core#readme"  // ⚠️ UPDATE USERNAME
}
```

### In README.md:
✅ **Already updated** - all imports use `@tsichart/core`

### In LICENSE:
⚠️ Replace `[Your Name/Organization]` with your actual name

That's it! You're ready to publish.
