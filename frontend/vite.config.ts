import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/breaking-beans-card.ts',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'breaking-beans-card.js',
      },
    },
  },
});
