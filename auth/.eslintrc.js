module.exports = {
  'root': true,
  'parser': 'babel-eslint',
  'extends': [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'standard'
  ],
  'plugins': [
    'jsx-a11y'
  ],
  'settings': {
    'react': {
      'version': '16.5.2'
    }
  },
  'rules': {
    'jsx-a11y/label-has-for': 0,
    "react/no-unescaped-entities": ["error", {"forbid": [">", "}"]}],
  },
  'env': {
    'browser': true,
    'es6': true,
    'jest': true,
    'node': true
  }
}
