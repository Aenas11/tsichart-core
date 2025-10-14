# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-13

### Added
- First release as **Time Series Interactive Charts** (`@tsichart/core`)
- Community-maintained generic time series visualization library
- Full TypeScript support with type definitions
- Tree-shakeable ES modules
- Comprehensive documentation
- 20+ interactive chart components for time series visualization

### Changed
- Rebranded from Microsoft's `tsiclient` to `@tsichart/core`
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
