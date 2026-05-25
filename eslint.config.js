const js = require('@eslint/js');
const jest = require('eslint-plugin-jest');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  js.configs.recommended,
  prettierRecommended,
  {
    rules: {
      'no-console': 'off',
    },
    languageOptions: {
      globals: {
        $: 'writable',
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
        global: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        __dirname: 'readonly',
      },
    },
  },
  {
    files: ['test/**/*.js'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/consistent-test-it': 'error',
      'jest/no-disabled-tests': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/no-large-snapshots': 'error',
      'jest/no-test-prefixes': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/prefer-to-be': 'error',
      'jest/valid-describe-callback': 'error',
      'jest/valid-expect': 'error',
      'jest/valid-expect-in-promise': 'error',
    },
  },
  {
    ignores: ['node_modules/', 'coverage/'],
  },
];
