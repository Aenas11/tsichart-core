# GitHub Copilot Instructions

Thank you for helping with our project! Here are some guidelines to help you be more effective in this codebase.

## Project Overview

This is the `tsichart-core` repository, a powerful, flexible JavaScript library for visualizing time series data with interactive charts. It is built with TypeScript and D3.js. The project is a community-maintained fork of the original Microsoft Time Series Insights Client.

The core logic and components are located in the `packages/core` directory. This is a monorepo managed with `pnpm` workspaces.

## Architecture

- **Component-Based:** The library is composed of various chart components located in `packages/core/src/components`. Each component is a class (e.g., `LineChart`, `BarChart`).
- **Class-Based Inheritance:** Components often inherit from base classes that provide common functionality. For example, `LineChart` extends `TemporalXAxisComponent`, which provides a foundation for charts with a time-based x-axis.
- **D3.js for Rendering:** We use D3.js extensively for DOM manipulation, data binding, and creating SVG visualizations. Familiarity with D3 patterns like selections, scales, and the enter/update/exit pattern is crucial.
- **Internal State Management:** Components manage their own state as class properties (e.g., `brushStartTime`, `focusedAggKey` in `LineChart`). There is no external state management library like Redux or MobX.

## Development Workflow

1.  **Installation:** Run `pnpm install` in the root directory to install all dependencies for the workspace.
2.  **Local Development (Storybook):** The primary way to develop and test components is using Storybook. Run `pnpm storybook` to start the Storybook server. This allows you to see components in isolation, interact with them, and test different states.
3.  **Building:** To build the `tsichart-core` package, run `pnpm --filter tsichart-core build`.
4.  **Testing:** Tests are written with Vitest. The configuration is in `vitest.config.ts`.

## Key Files and Directories

- `packages/core/src/components/`: This is where the main chart components live. When you need to modify a chart, you'll likely be working here.
- `packages/core/src/UXClient.ts`: This is the main entry point for the library, where all the components are brought together.
- `stories/`: Contains the Storybook stories for each component. When working on a component, it's a good idea to look at its corresponding story to see how it's used.
- `pages/examples/`: Contains live examples that are published to GitHub Pages.

## Coding Conventions and Patterns

- **Monolithic Components:** Some components, like `LineChart.ts`, are very large and handle many responsibilities (rendering, interaction, state). When adding new functionality, consider if it can be broken down into smaller, private methods or even separate helper classes to improve maintainability.
- **Data Format:** All components expect data in a specific JSON format. An example of this format is in the root `README.MD`. The components are responsible for parsing this format and rendering the visualization.
- **Event Handlers:** User interactions like mouseovers, clicks, and brushing are handled by methods within the component class (e.g., `voronoiMouseover`, `brushEnd` in `LineChart`).

Thank you for your contributions!
