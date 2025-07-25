import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/securepass-sdk.js',
  output: [
    {
      file: 'dist/securepass-sdk.js',
      format: 'umd',
      name: 'SecurePassSDK',
      sourcemap: true
    },
    {
      file: 'dist/securepass-sdk.min.js',
      format: 'umd',
      name: 'SecurePassSDK',
      plugins: [terser()],
      sourcemap: true
    },
    {
      file: 'dist/securepass-sdk.esm.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    resolve(),
    commonjs()
  ],
  external: []
}; 