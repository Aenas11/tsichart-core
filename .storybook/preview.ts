import type { Preview } from '@storybook/web-components-vite'
// Import the core styles for TSIChart components
import '../packages/core/src/styles/index.scss';

// Import d3 and moment to ensure they're available globally
import * as d3 from 'd3';
import * as moment from 'moment';

// Make dependencies available globally
(window as any).d3 = d3;
(window as any).moment = moment;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    docs: {
      toc: true, // Enable table of contents
    },

    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'gray',
          value: '#f5f5f5',
        },
      ],
    },
  },

  // Global decorators for all stories
  decorators: [
    (story) => {
      // Ensure dependencies are available for charts
      if (typeof window !== 'undefined') {
        (window as any).d3 = d3;
        (window as any).moment = moment;
      }
      return story();
    },
  ],
};

export default preview;