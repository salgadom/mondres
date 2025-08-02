import { defineConfig } from 'vite';
import path from 'path';
import fg from 'fast-glob';

const iifeFiles = fg.sync('src/iife/*.js');

const input = Object.fromEntries(
  iifeFiles.map((file) => {
    const name = path.basename(file, '.js');
    return [name, path.resolve(__dirname, file)];
  })
);

export default defineConfig({
  build: {
    rollupOptions: {
      input,
      output: {
        format: 'iife',
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist_iife',
    emptyOutDir: true, // Don't clear esm build
  },
});