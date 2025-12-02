// This file has been automatically migrated to valid ESM format by Storybook.
import { createRequire } from "node:module";
import type { StorybookConfig } from '@storybook/web-components-vite';

import { join, dirname } from "path"

const require = createRequire(import.meta.url);

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-vitest")
  ],
  "framework": {
    "name": getAbsolutePath('@storybook/web-components-vite'),
    "options": {}
  },
  async viteFinal(config) {
    // Ensure VITE_ prefixed environment variables are available in the build
    // This is needed for variables set in CI/CD (GitHub Actions)
    config.define = config.define || {};
    config.define['import.meta.env.VITE_AZURE_MAPS_KEY'] = JSON.stringify(
      process.env.VITE_AZURE_MAPS_KEY || ''
    );
    return config;
  }
};
export default config;