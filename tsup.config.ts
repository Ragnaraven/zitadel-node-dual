import { defineConfig } from 'tsup';

// CJS-only build for NestJS/Node environments; declarations generated separately
export default defineConfig({
  entry: ['src/**/*.ts'],
  format: ['cjs'],
  dts: false,
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  bundle: false,
  target: 'node18',
  platform: 'node',
  outDir: 'dist/cjs',
  outExtension: () => ({ js: '.js' }),
});