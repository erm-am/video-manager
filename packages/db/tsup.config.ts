import { defineConfig } from 'tsup';

const tsupConfig = defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  minify: true,
  clean: true,
  tsconfig: 'tsconfig.json',
});

export default tsupConfig;
