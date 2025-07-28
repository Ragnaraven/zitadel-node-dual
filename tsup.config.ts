import { defineConfig } from 'tsup';

export default defineConfig([
  // Build ESM
  {
    entry: ['src/**/*.ts'],
    format: ['esm'],
    dts: false, // Generate types separately to avoid conflicts
    clean: false,
    splitting: false,
    sourcemap: true,
    minify: false,
    bundle: false,
    target: 'node18',
    platform: 'node',
    outDir: 'dist/esm',
    outExtension: () => ({ js: '.js' }),
  },
  // Build CJS 
  {
    entry: ['src/**/*.ts'],
    format: ['cjs'],
    dts: false, // Generate types separately to avoid conflicts
    clean: false,
    splitting: false,
    sourcemap: true,
    minify: false,
    bundle: false,
    target: 'node18',
    platform: 'node',
    outDir: 'dist/cjs',
    outExtension: () => ({ js: '.js' }),
  },
  // Generate TypeScript declarations
  {
    entry: ['src/**/*.ts'],
    dts: { only: true }, // Only generate .d.ts files
    clean: true, // Clean dist folder before first build
    outDir: 'dist/types',
  },
]); 