/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|d3|d3-.*|internmap|delaunator|robust-predicates))'
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__tests__/mocks/styleMock.js',
    '\\.(svg)$': '<rootDir>/__tests__/mocks/svgMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/utils$': '<rootDir>/src/utils/index.ts',
    '^@/models$': '<rootDir>/src/models',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@/interfaces/(.*)$': '<rootDir>/src/interfaces/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.stories.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 50,  // Starting low, will increase as we add tests
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/',
    '/dist/'
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }],
    '^.+\\.jsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  }
};
