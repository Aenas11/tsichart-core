# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0-beta.7] - 2025-10-24

### Changes
- Release version 2.0.0-beta.7

## [2.0.0-beta.6] - 2025-10-23

### Changes
- Release version 2.0.0-beta.6

## [2.0.0-beta.5] - 2025-10-23

### Changes
- Release version 2.0.0-beta.5

## [2.0.0-beta.4] - 2025-10-23

### Changes
- Release version 2.0.0-beta.4

## [tsichart-core] - 2025-10-17

### Changes
- Release version tsichart-core

## [2.0.0-beta.1] - 2025-10-16

### 🎉 Beta Release - Monorepo Restructure

This is a **beta release** of `tsichart-core` for testing and feedback before the final v2.0.0 release.

### Added
- ✨ **Monorepo Structure**: Migrated to pnpm workspaces for better package management
- ✨ **Testing Infrastructure**: Comprehensive Jest testing setup with 114 tests
  - Unit tests for Models (AxisState, ChartDataOptions, ChartOptions) - 100% coverage
  - Unit tests for Utilities (Utils class) - 15 tests
  - Unit tests for Components (Tooltip, EllipsisMenu, ColorPicker) - 65 tests
  - Test coverage: 6.07% statements (foundation for future expansion)
- ✨ **ES Modules Support**: Dual package format (ESM + CommonJS)
- ✨ **Tree-shaking**: Optimized exports for better bundle sizes
- ✨ **TypeScript Definitions**: Full TypeScript support with generated `.d.ts` files
- ✨ **CI/CD Improvements**: GitHub Actions workflows for testing and automated publishing
- ✨ **Path Aliases**: Support for `@/*` imports in source code
- ✨ **Browser API Mocks**: ResizeObserver, IntersectionObserver for testing environment
- ✨ **Build Artifacts Tracking**: Added bundle size visualization
- ✨ **Release Documentation**: Comprehensive RELEASE_GUIDE.md

### Changed
- 🔄 **Package Name**: Scoped package `tsichart-core` (was `tsichart-core`)
- 🔄 **Build System**: Unified on Rollup 4 for consistent, optimized builds
- 🔄 **Export Structure**: Clean, modular exports instead of window globals
- 🔄 **Directory Structure**: Reorganized into `packages/core` monorepo structure
- 🔄 **Removed Window Globals**: No longer attaches to `window.TsiClient` (SSR-compatible)
- 🔄 **TypeScript Config**: Updated for monorepo with workspace references
- 🔄 **Dependencies**: Updated to latest versions (D3 7.9.0, TypeScript 5.9.3)

### Fixed
- 🐛 Fixed D3 ESM module imports in Jest tests
- 🐛 Fixed jsdom environment compatibility issues with color formats
- 🐛 Fixed TypeScript configuration for monorepo setup
- 🐛 Fixed SCSS handling in Rollup build pipeline
- 🐛 Fixed path resolution for workspace packages
- 🐛 Identified and documented ChartOptions.toObject() bug for future fix

### Breaking Changes
- ❌ **Removed `window.TsiClient` global** - No longer compatible with UMD browser scripts
- ❌ **Changed package name** - Update from `tsichart-core` to `tsichart-core`
- ❌ **Changed import paths** - See migration guide below
- ❌ **Removed UMD build** - Use ESM or CommonJS instead

### Migration Guide

**Before (v1.x):**
```typescript
// Browser UMD
<script src="tsiclient.js"></script>
<script>
  const tsiClient = new window.TsiClient();
</script>

// NPM
import TsiClient from 'tsichart-core';
```

**After (v2.0):**
```typescript
// ESM
import { UXClient, LineChart } from 'tsichart-core';
import 'tsichart-core/styles';

const uxClient = new UXClient();
const chart = new LineChart(containerElement);

// CommonJS
const { UXClient, LineChart } = require('tsichart-core');
require('tsichart-core/styles');
```

**Tree-shaking Example:**
```typescript
// Import only what you need
import { LineChart } from 'tsichart-core/components/LineChart';
import { ChartOptions } from 'tsichart-core/models/ChartOptions';
```

### Package Details
- **Package**: `tsichart-core`
- **Version**: 2.0.0
- **License**: MIT
- **Repository**: https://github.com/Aenas11/tsichart-core
- **Node.js**: v22+ recommended
- **Package Manager**: pnpm 10.11.0 (workspaces)
- **TypeScript**: 5.9.3
- **D3.js**: 7.9.0
- **Testing**: Jest 29.7.0 with ts-jest

### Test Coverage (v2.0.0)
- **Statements**: 6.07% (551/9,068)
- **Branches**: 4.31% (249/5,777)
- **Functions**: 4.43% (87/1,960)
- **Lines**: 6.37% (544/8,539)
- **Test Suites**: 7 passed
- **Tests**: 109 passed, 5 skipped
- **Target**: 50% coverage (planned for future releases)

### Documentation Updates
- ✅ Comprehensive README.md for core package
- ✅ RELEASE_GUIDE.md for publishing process
- ✅ Updated RESTRUCTURING_PLAN.md with implementation status
- ✅ Test documentation inline with source files
- ✅ CHANGELOG.md (this file)

### Development Environment
- **IDE**: VS Code with TypeScript support
- **Container**: Debian GNU/Linux 12 (bookworm) dev container
- **Git**: Latest version built from source
- **Node Tools**: node, npm, pnpm, eslint, tsc

### Future Plans
- 📈 Increase test coverage to 50%+ (planned)
- 🧪 Add integration tests for complex components (planned)
- 🎨 Add visual regression testing (planned)
- ⚡ Performance benchmarks (planned)
- 📦 React package `tsichart-react` (deferred - not in scope for v2.0)
- 📦 Vue package `tsichart-vue` (deferred - not in scope for v2.0)

### Contributors
- Alex Sysoiev (@Aenas11)

---

## [1.0.0] - 2025-10-13

### Added
- First release as **Time Series Interactive Charts** (`tsichart-core`)
- Community-maintained generic time series visualization library
- Full TypeScript support with type definitions
- Tree-shakeable ES modules
- Comprehensive documentation
- 20+ interactive chart components for time series visualization

### Changed
- Rebranded from Microsoft's `tsiclient` to `tsichart-core`
- **TSI** now stands for **Time Series Interactive** (not Time Series Insights)
- Updated all branding to be generic (removed Azure-specific references)
- Modernized build system and dependencies
- Updated README with generic examples and use cases
- Focused purely on client-side interactive visualizations

### Removed
- All Azure Time Series Insights-specific server API calls
- Azure TSI-specific data transformation functions
- Deprecated authentication helpers
- Cloud service dependencies

## [2.1.0] - Previous Microsoft Version

This version was the last release by Microsoft before the Azure Time Series Insights service was deprecated.

---

## Migration Notes

If you're migrating from Microsoft's original `tsiclient` v2.x:

1. Update package.json: `npm install @tsichart-core`
2. Update imports: `import TsiClient from '@tsichart-core'`
3. The visualization components API remains unchanged
4. Remove any server-side API calls (you should handle data fetching separately)
5. Note: TSI now means "Time Series Interactive" not "Time Series Insights"
