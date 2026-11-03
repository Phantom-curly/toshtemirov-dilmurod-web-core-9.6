import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  { ignores: ['dist/**'] },

  js.configs.recommended,

  // Browser code
  {
    files: ['src/js/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.browser
    }
  },

  // Config files in the project root (webpack.config.js) run in Node
  {
    files: ['*.js', '*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node
    }
  },

  // Turn off rules that conflict with Prettier (keep last)
  prettier
]
