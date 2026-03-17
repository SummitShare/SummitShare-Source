import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
   ...nextVitals,
   {
      rules: {
         'react-hooks/set-state-in-effect': 'off',
         'react-hooks/immutability': 'off',
         'react-hooks/error-boundaries': 'off',
      },
   },
   prettierConfig,
   globalIgnores([
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'postcss.config.js',
   ]),
]);
