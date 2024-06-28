module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
      'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
      'plugin:jsx-a11y/recommended', // Uses the recommended rules from @eslint-plugin-jsx-a11y
      'plugin:import/errors', // Uses the recommended rules from @eslint-plugin-import
      'plugin:import/warnings',
      'plugin:import/typescript',
      'plugin:react-hooks/recommended',
      'plugin:@next/next/recommended', // Uses the recommended rules from @next/eslint-plugin-next
    ],
    parserOptions: {
      ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
      sourceType: 'module', // Allows for the use of imports
      ecmaFeatures: {
        jsx: true, // Allows for the parsing of JSX
      },
    },
    settings: {
      react: {
        version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
      },
      'import/resolver': {
        typescript: {}, // This loads <rootdir>/tsconfig.json to eslint
      },
    },
    rules: {
      // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Ignore unused variables that start with an underscore
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Turn off explicit return type requirement
      '@typescript-eslint/no-explicit-any': 'warn', // Warn on use of the any type
      'react/prop-types': 'off', // Turn off prop-types as we use TypeScript for type checking
      'react/react-in-jsx-scope': 'off', // React 17+ JSX Transform
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'internal']],
          'newlines-between': 'always',
        },
      ], // Enforce import order
      'react-hooks/exhaustive-deps': 'warn', // Warn for missing dependencies in useEffect
      'react/jsx-key': 'error', // Error when missing key prop in iterators
      'react/no-unescaped-entities': 'error', // Error for unescaped entities in JSX
      '@next/next/no-async-client-component': 'error', // Prevent async client components
    },
    overrides: [
      {
        files: ['*.ts', '*.tsx'], // Apply these rules to TypeScript files only
        rules: {
          '@typescript-eslint/no-var-requires': 'off', // Allow require statements in TypeScript files
        },
      },
    ],
  };
  