<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
/// <reference types="vitest/globals" />
=======
>>>>>>> 7055322ec922188f65223b2000a759252bbbb96f
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
=======
>>>>>>> origin/airefactoring
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
