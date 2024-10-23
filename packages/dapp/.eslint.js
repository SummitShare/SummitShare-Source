module.exports = {
   parser: '@typescript-eslint/parser',
   extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:react-hooks/recommended',
      'plugin:@next/next/recommended',
      'prettier', // Add Prettier last
   ],
   plugins: ['prettier'], // Add Prettier plugin
   parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
         jsx: true,
      },
   },
   settings: {
      react: {
         version: 'detect',
      },
      'import/resolver': {
         typescript: {},
      },
   },
   rules: {
      'prettier/prettier': 'error', // Ensure Prettier rules are enforced
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/order': [
         'error',
         {
            groups: [['builtin', 'external', 'internal']],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
         },
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'error',
      'react/no-unescaped-entities': 'error',
      '@next/next/no-async-client-component': 'error',
      'jsx-a11y/anchor-is-valid': [
         'error',
         {
            components: ['Link'],
            specialLink: ['hrefLeft', 'hrefRight'],
            aspects: ['invalidHref', 'preferButton'],
         },
      ],
      'jsx-a11y/alt-text': [
         'error',
         {
            elements: ['img', 'object', 'area', 'input[type="image"]'],
            img: ['Image'],
            object: ['Object'],
            area: ['Area'],
            'input[type="image"]': ['InputImage'],
         },
      ],
   },
   overrides: [
      {
         files: ['*.ts', '*.tsx'],
         rules: {
            '@typescript-eslint/no-var-requires': 'off',
         },
      },
   ],
};
