import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['cjs'], // CJS only for now
  dts: false, // Skip declarations to avoid TypeScript errors
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  bundle: false, // Preserve structure
  target: 'node18',
  platform: 'node',
  outExtension: () => ({
    js: '.js', // Use .js for CJS to match import paths
  }),
}); 