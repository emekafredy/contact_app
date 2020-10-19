module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  env: {
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  rules: {
    'max-len': ['warn', { code: 120, ignoreUrls: true }],
    'consistent-return': 0,
    'comma-dangle': 0,
    'no-fallthrough': 0,
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'no-trailing-spaces': ['error', { skipBlankLines: true }],
    'no-underscore-dangle': 'error',
    'eol-last': ['error', 'always'],
    'no-use-before-define': 'off',
    'import/prefer-default-export': 0,
    'no-param-reassign': 0
  }
};
