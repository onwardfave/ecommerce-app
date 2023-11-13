module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      // Add more specific rulesets like 'plugin:@typescript-eslint/recommended-requiring-type-checking'
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: false,
      },
      // if you're using a tsconfig file, specify its path here
      project: ['./tsconfig.json']
    },
    rules: {
      // Customize your rules
    },
  };
  
