import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  external: ['react', 'react-dom'],
  injectStyle: false,
  // Copy CSS to dist/styles.css alongside the JS bundles
  onSuccess: 'cp src/styles.css dist/styles.css',
});
