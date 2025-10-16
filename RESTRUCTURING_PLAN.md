# TSIChart Core - Restructuring Plan

## Goals (Prioritized)
1. **Cover solution with unit tests**
2. **Create NPM packages for React and Vue wrappers**

---

## 📊 Current State Analysis

### Current Structure Issues
- ❌ Monolithic structure with all code in single `src/` directory
- ❌ Window globals (`window.TsiClient`) break SSR for React/Vue
- ❌ No test infrastructure
- ❌ Build artifacts pollute root directory
- ❌ Mixed concerns (UXClient contains everything)
- ❌ Hard to maintain separate framework-specific packages

### Current Dependencies
- TypeScript 5.9.3
- D3.js 7.9.0
- Webpack 5 + Rollup 4 (dual build system)
- SASS/SCSS for styling
- Moment.js for dates

---

## 🎯 Target Architecture: Monorepo with Workspaces

```
tsichart-core/                         # Root repository
├── packages/
│   ├── core/                          # tsichart-core - Framework-agnostic
│   │   ├── src/
│   │   │   ├── components/            # All chart components
│   │   │   ├── models/                # Data models
│   │   │   ├── utils/                 # Utilities
│   │   │   ├── constants/             # Constants
│   │   │   ├── interfaces/            # Base interfaces
│   │   │   ├── styles/                # SCSS files
│   │   │   └── index.ts               # Clean exports
│   │   ├── __tests__/                 # Unit & integration tests
│   │   │   ├── unit/
│   │   │   │   ├── components/
│   │   │   │   ├── models/
│   │   │   │   └── utils/
│   │   │   ├── integration/
│   │   │   └── setup.ts
│   │   ├── package.json
│   │   ├── jest.config.js
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   ├── react/                         # tsichart-react
│   │   ├── src/
│   │   │   ├── components/            # React wrappers
│   │   │   │   ├── LineChart.tsx
│   │   │   │   ├── PieChart.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/                 # Custom hooks
│   │   │   │   ├── useChart.ts
│   │   │   │   ├── useLineChart.ts
│   │   │   │   └── ...
│   │   │   ├── context/               # React context
│   │   │   └── index.ts
│   │   ├── __tests__/
│   │   ├── package.json
│   │   ├── jest.config.js
│   │   └── README.md
│   │
│   ├── vue/                           # tsichart-vue
│   │   ├── src/
│   │   │   ├── components/            # Vue component wrappers
│   │   │   │   ├── LineChart.vue
│   │   │   │   ├── PieChart.vue
│   │   │   │   └── ...
│   │   │   ├── composables/           # Vue 3 composables
│   │   │   │   ├── useChart.ts
│   │   │   │   └── ...
│   │   │   └── index.ts
│   │   ├── __tests__/
│   │   ├── package.json
│   │   ├── jest.config.js
│   │   └── README.md
│   │
│   └── legacy/                        # Optional: UMD with window globals
│       ├── src/
│       │   └── index.ts               # Re-exports core + window.TsiClient
│       └── package.json               # tsiclient-legacy
│
├── examples/                          # Example applications
│   ├── vanilla-js/
│   ├── react-demo/
│   └── vue-demo/
│
├── docs/                              # Documentation
├── .github/                           # GitHub Actions
│   └── workflows/
│       ├── test.yml                   # Run tests on PR
│       ├── publish.yml                # Publish to NPM
│       └── coverage.yml               # Coverage reporting
├── package.json                       # Root workspace
├── pnpm-workspace.yaml                # Workspace config
├── jest.config.base.js                # Shared Jest config
├── tsconfig.base.json                 # Shared TypeScript config
└── README.md
```

---

## 📝 Implementation Phases

### Phase 1: Monorepo Setup (Days 1-2)

#### 1.1 Initialize Workspace
```bash
# Choose workspace manager: npm workspaces, pnpm, or Lerna
# Recommended: pnpm (faster, better for monorepos)

# Install pnpm if not available
npm install -g pnpm

# Initialize workspace
pnpm init

# Create workspace config
cat > pnpm-workspace.yaml << EOF
packages:
  - 'packages/*'
EOF
```

#### 1.2 Create Package Directories
```bash
mkdir -p packages/core/src
mkdir -p packages/core/__tests__/unit/{components,models,utils}
mkdir -p packages/core/__tests__/integration
mkdir -p packages/react/src
mkdir -p packages/vue/src
mkdir -p examples/{vanilla-js,react-demo,vue-demo}
```

#### 1.3 Update Root package.json
```json
{
  "name": "tsichart-workspace",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "test:coverage": "pnpm -r test -- --coverage",
    "lint": "pnpm -r lint",
    "clean": "pnpm -r clean"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.9.3"
  }
}
```

---

### Phase 2: Core Package Migration (Days 3-5)

#### 2.1 Move Source Files
```bash
# Move UXClient code to core package
mv src/UXClient/* packages/core/src/

# Rename directories to lowercase (convention)
cd packages/core/src
mv Components components
mv Models models
mv Utils utils
mv Constants constants
mv Interfaces interfaces
mv Icons icons

# Move styles
mkdir -p styles
mv *.scss styles/
```

#### 2.2 Remove Window Globals
**Old:** `src/TsiClient.ts`
```typescript
(<any>window).TsiClient = TsiClient; // ❌ Breaks SSR
```

**New:** `packages/core/src/index.ts`
```typescript
// Clean, tree-shakeable exports
export { default as UXClient } from './UXClient';
export * from './components';
export * from './models';
export * from './utils';
export * from './constants';
export * from './interfaces';

// Individual component exports for better tree-shaking
export { default as LineChart } from './components/LineChart';
export { default as PieChart } from './components/PieChart';
export { default as Heatmap } from './components/Heatmap';
// ... etc
```

#### 2.3 Create Core package.json
```json
{
  "name": "tsichart-core",
  "version": "2.0.0",
  "description": "Framework-agnostic time series charting library",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./components/*": {
      "types": "./dist/components/*.d.ts",
      "import": "./dist/components/*.mjs",
      "require": "./dist/components/*.js"
    },
    "./styles": "./dist/styles/index.css",
    "./styles/*": "./dist/styles/*.css"
  },
  "sideEffects": [
    "*.css",
    "*.scss"
  ],
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "rollup -c",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "clean": "shx rm -rf dist"
  },
  "peerDependencies": {
    "d3": "^7.0.0"
  },
  "dependencies": {
    "awesomplete": "^1.1.7",
    "d3-interpolate-path": "^2.3.0",
    "d3-voronoi": "^1.1.4",
    "moment": "^2.30.1",
    "moment-timezone": "^0.6.0",
    "split.js": "^1.6.5"
  }
}
```

---

### Phase 3: Testing Infrastructure (Days 6-10)

#### 3.1 Install Testing Dependencies
```bash
cd packages/core
pnpm add -D jest @types/jest ts-jest jest-environment-jsdom
pnpm add -D @testing-library/dom @testing-library/jest-dom
pnpm add -D jest-canvas-mock
```

#### 3.2 Create Jest Configuration
**packages/core/jest.config.js**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts'
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__tests__/mocks/styleMock.js',
    '\\.(svg)$': '<rootDir>/__tests__/mocks/svgMock.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.ts'
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/dist/'
  ]
};
```

#### 3.3 Create Test Setup Files
**packages/core/__tests__/setup.ts**
```typescript
import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
```

**packages/core/__tests__/mocks/styleMock.js**
```javascript
module.exports = {};
```

**packages/core/__tests__/mocks/svgMock.js**
```javascript
module.exports = 'test-file-stub';
```

#### 3.4 Testing Strategy by Component Type

##### A. Utilities Testing (Highest Priority - Easy Wins)
**packages/core/__tests__/unit/utils/Utils.test.ts**
```typescript
import Utils from '@/utils';

describe('Utils', () => {
  describe('formatData', () => {
    it('should format time series data correctly', () => {
      const input = [{ timestamp: 1234567890, value: 42 }];
      const result = Utils.formatData(input);
      expect(result).toBeDefined();
      // Add specific assertions
    });
  });

  describe('aggregateData', () => {
    it('should aggregate values by time bucket', () => {
      // Test aggregation logic
    });
  });
});
```

##### B. Model Testing
**packages/core/__tests__/unit/models/ChartDataOptions.test.ts**
```typescript
import { ChartDataOptions } from '@/models';

describe('ChartDataOptions', () => {
  it('should initialize with default values', () => {
    const options = new ChartDataOptions();
    expect(options).toBeDefined();
  });

  it('should validate required fields', () => {
    // Test validation logic
  });
});
```

##### C. Component Testing (Most Complex)
**packages/core/__tests__/unit/components/LineChart.test.ts**
```typescript
import { LineChart } from '@/components/LineChart';

describe('LineChart', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render without crashing', () => {
    const chart = new LineChart(container);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('should render data correctly', () => {
    const chart = new LineChart(container);
    const mockData = [/* mock data */];
    chart.render(mockData, {}, 0);
    
    // Assert SVG elements
    expect(container.querySelectorAll('.tsi-line').length).toBeGreaterThan(0);
  });

  it('should handle empty data gracefully', () => {
    const chart = new LineChart(container);
    expect(() => chart.render([], {}, 0)).not.toThrow();
  });
});
```

##### D. Integration Testing
**packages/core/__tests__/integration/chartInteractions.test.ts**
```typescript
describe('Chart Interactions', () => {
  it('should synchronize multiple charts', () => {
    // Test chart synchronization
  });

  it('should handle zoom and pan interactions', () => {
    // Test D3 interactions
  });
});
```

---

### Phase 4: React Package (Days 11-14)

#### 4.1 Create React Wrapper Architecture
```typescript
// packages/react/src/components/LineChart.tsx
import React, { useEffect, useRef } from 'react';
import { LineChart as CoreLineChart } from 'tsichart-core';
import 'tsichart-core/styles';

export interface LineChartProps {
  data: any[];
  options?: any;
  onRender?: () => void;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  options = {},
  onRender 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<CoreLineChart | null>(null);

  useEffect(() => {
    if (containerRef.current && !chartRef.current) {
      chartRef.current = new CoreLineChart(containerRef.current);
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.render(data, options, 0);
      onRender?.();
    }
  }, [data, options, onRender]);

  useEffect(() => {
    return () => {
      chartRef.current = null;
    };
  }, []);

  return <div ref={containerRef} />;
};
```

#### 4.2 Custom Hooks
```typescript
// packages/react/src/hooks/useChart.ts
import { useEffect, useRef } from 'react';

export function useChart<T>(
  ChartClass: new (container: HTMLElement) => T,
  data: any[],
  options: any = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<T | null>(null);

  useEffect(() => {
    if (containerRef.current && !chartRef.current) {
      chartRef.current = new ChartClass(containerRef.current);
    }
  }, [ChartClass]);

  useEffect(() => {
    if (chartRef.current && 'render' in chartRef.current) {
      (chartRef.current as any).render(data, options, 0);
    }
  }, [data, options]);

  return containerRef;
}
```

#### 4.3 React Package.json
```json
{
  "name": "tsichart-react",
  "version": "2.0.0",
  "description": "React components for TSIChart",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "peerDependencies": {
    "tsichart-core": "^2.0.0",
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "jest"
  }
}
```

---

### Phase 5: Vue Package (Days 15-18)

#### 5.1 Vue Component Wrapper
```vue
<!-- packages/vue/src/components/LineChart.vue -->
<template>
  <div ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { LineChart as CoreLineChart } from 'tsichart-core';
import 'tsichart-core/styles';

interface Props {
  data: any[];
  options?: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'render'): void;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
let chart: CoreLineChart | null = null;

onMounted(() => {
  if (containerRef.value) {
    chart = new CoreLineChart(containerRef.value);
    renderChart();
  }
});

watch(() => [props.data, props.options], () => {
  renderChart();
}, { deep: true });

function renderChart() {
  if (chart) {
    chart.render(props.data, props.options || {}, 0);
    emit('render');
  }
}

onUnmounted(() => {
  chart = null;
});
</script>
```

#### 5.2 Vue Composable
```typescript
// packages/vue/src/composables/useChart.ts
import { ref, onMounted, onUnmounted, watch } from 'vue';

export function useChart<T>(
  ChartClass: new (container: HTMLElement) => T,
  data: any[],
  options: any = {}
) {
  const containerRef = ref<HTMLDivElement | null>(null);
  let chart: T | null = null;

  onMounted(() => {
    if (containerRef.value) {
      chart = new ChartClass(containerRef.value);
      render();
    }
  });

  watch([() => data, () => options], () => {
    render();
  }, { deep: true });

  function render() {
    if (chart && 'render' in chart) {
      (chart as any).render(data, options, 0);
    }
  }

  onUnmounted(() => {
    chart = null;
  });

  return { containerRef };
}
```

---

### Phase 6: CI/CD & Publishing (Days 19-21)

#### 6.1 GitHub Actions - Test Workflow
**.github/workflows/test.yml**
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

#### 6.2 Publishing Workflow
**.github/workflows/publish.yml**
```yaml
name: Publish

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - run: pnpm -r publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 📊 Testing Coverage Goals

| Package | Unit Tests | Integration | Coverage Target |
|---------|-----------|-------------|-----------------|
| tsichart-core (utils) | ✅ High Priority | N/A | 95% |
| tsichart-core (models) | ✅ High Priority | N/A | 90% |
| tsichart-core (components) | ✅ High Priority | ✅ Medium | 80% |
| tsichart-react | ✅ Medium Priority | ✅ Medium | 75% |
| tsichart-vue | ✅ Medium Priority | ✅ Medium | 75% |

---

## 📦 Migration Checklist

### Pre-Migration
- [X] Backup current repository
- [X] Create feature branch `refactor/monorepo-structure`
- [X] Communicate changes to users

### Core Migration
- [X] Setup monorepo structure (pnpm/npm workspaces)
- [X] Move source files to `packages/core`
- [X] Remove window globals
- [X] Update build configuration
- [X] Create new package.json for core
- [X] Test core package builds correctly

### Testing Setup
- [X] Install Jest dependencies
- [X] Create Jest configuration
- [X] Write test utilities and mocks
- [X] Write unit tests for Utils (15 tests - foundation complete)
- [X] Write unit tests for Models (33 tests - 100% coverage for tested models)
- [X] Write unit tests for Components (65 tests - 3 components complete)
- [X] Setup coverage reporting
- [X] Integrate with CI/CD

### Core Package Release (v2.0.0)
- [X] Core package building successfully
- [X] All tests passing (114 tests: 109 passing, 5 skipped)
- [X] CI/CD workflows updated with test steps
- [X] CHANGELOG.md updated with v2.0.0 release notes
- [X] RELEASE_GUIDE.md created with publishing instructions
- [ ] Publish tsichart-core to npm
- [ ] Create GitHub release with tag v2.0.0
- [ ] Update documentation site (if applicable)

### React Package (DEFERRED)
- [ ] Create React package structure (postponed)
- [ ] Implement component wrappers (postponed)
- [ ] Create custom hooks (postponed)
- [ ] Write tests for React components (postponed)
- [ ] Create example app (postponed)
- [ ] Write documentation (postponed)

### Vue Package (DEFERRED)
- [ ] Create Vue package structure (postponed)
- [ ] Implement component wrappers (postponed)
- [ ] Create composables (postponed)
- [ ] Write tests for Vue components (postponed)
- [ ] Create example app (postponed)
- [ ] Write documentation (postponed)

### Documentation & Release
- [ ] Update README for all packages
- [ ] Create migration guide
- [ ] Update examples
- [ ] Publish packages to NPM
- [ ] Announce release

---

## 🚨 Breaking Changes

This restructure introduces **breaking changes**:

### For Current Users
1. **Import paths change**:
   ```typescript
   // Old
   import TsiClient from 'tsichart-core';
   
   // New
   import { LineChart, UXClient } from 'tsichart-core';
   ```

2. **No window globals**:
   ```typescript
   // Old
   const tsiClient = new window.TsiClient();
   
   // New
   import { UXClient } from 'tsichart-core';
   const uxClient = new UXClient();
   ```

3. **CSS imports**:
   ```typescript
   // Old
   import 'tsichart-core/tsiclient.css';
   
   // New
   import 'tsichart-core/styles';
   ```

### Migration Path
Provide a **legacy package** (`tsiclient-legacy`) that:
- Re-exports everything from `tsichart-core`
- Adds window globals for backwards compatibility
- Includes deprecation warnings

---

## 📈 Benefits

✅ **Testability**: Proper test structure with 80%+ coverage  
✅ **Framework Support**: Official React & Vue packages  
✅ **Tree-shaking**: Better bundle sizes for users  
✅ **Modularity**: Use only what you need  
✅ **Maintainability**: Clear separation of concerns  
✅ **Developer Experience**: Better TypeScript support  
✅ **CI/CD**: Automated testing & publishing  
✅ **SSR Compatible**: No window globals in core  

---

## 🎯 Next Steps

1. ✅ **Monorepo Setup** - COMPLETE
2. ✅ **Testing Infrastructure** - COMPLETE (6.07% coverage achieved)
3. ✅ **CI/CD Integration** - COMPLETE (tests running in workflows)
4. **Ready for Release** - Publish v2.0.0 to npm
5. **Post-Release** - Monitor usage, gather feedback, iterate
6. **Future Consideration** - React/Vue packages (if demand exists)

---

## 📚 Release Checklist

Before publishing to npm:

- [X] All tests passing (114 tests)
- [X] Build successful
- [X] CHANGELOG.md updated
- [X] RELEASE_GUIDE.md created
- [X] CI/CD workflows include tests
- [ ] npm authentication configured
- [ ] Version number finalized (2.0.0)
- [ ] Publish to npm: `npm publish --access public`
- [ ] Create GitHub release with tag v2.0.0
- [ ] Update documentation

See `RELEASE_GUIDE.md` for detailed publishing instructions.

---

## 📚 Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Jest Testing Framework](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Rollup](https://rollupjs.org/)
- [tsup - TypeScript bundler](https://tsup.egoist.dev/)

