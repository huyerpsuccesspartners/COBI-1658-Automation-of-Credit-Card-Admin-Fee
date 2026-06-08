module.exports = {
  env: {
    browser: true,
    amd: true,
  },
  extends: 'airbnb',
  globals: {
    log: 'readonly',
    expect: 'readonly',
    it: 'readonly',
    describe: 'readonly',
  },
  rules: {
    'import/no-amd': 'off',
    'max-len': 0,
    semi: 2,
    indent: ['error', 2],
    'function-paren-newline': ['error', 'consistent'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1, maxBOF: 0 }],
    'no-underscore-dangle': ['error', { allow: ['_*'] }],
    'no-console': ['error', { allow: ['log', 'error'] }],
  },
  overrides: [
    {
      files: ['src/**/*.js'],
    },
  ],
};
