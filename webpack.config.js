const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    // Entry file
    entry: './src/js/index.js',

    // Output files
    output: {
      filename: 'js/bundle.js',
      path: path.resolve(__dirname, 'dist'),
      // Delete old files from dist before each build
      clean: true
      // publicPath is left at its default ('auto'): asset URLs are relative,
      // so the site also works from a subfolder, e.g. https://USER.github.io/REPO/
    },

    // Source maps for easier debugging
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',

    module: {
      rules: [
        // Transpile js with babel (settings are in babel.config.json)
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'src/js'),
          use: 'babel-loader'
        },

        // Compile SCSS to CSS
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader, // Extract css to separate file
            'css-loader', // Resolves @import and url() in CSS
            'postcss-loader', // Adds vendor prefixes to CSS rules (autoprefixer)
            'sass-loader' // Compiles Sass to CSS
          ]
        },

        // Plain CSS, e.g. from packages: import 'swiper/css', normalize.css
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },

        // Include fonts from css
        {
          test: /\.(eot|ttf|otf|woff|woff2)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        },

        // Include images from css
        {
          test: /\.(svg|png|jpe?g|gif|webp|avif|ico)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/[name][ext]'
          }
        }
      ]
    },

    plugins: [
      // Include html file, styles and scripts will be automatically injected
      new HtmlWebpackPlugin({
        title: 'Webpack 5 Starter',
        template: './src/index.html',
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: false
        }
      }),

      // Extract styles to a separate file
      new MiniCssExtractPlugin({
        filename: 'style.css'
      }),

      // Copy images used in HTML (<img src="./img/...">)
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './src/img',
            to: 'img',
            noErrorOnMissing: true
          }
        ]
      })
    ],

    optimization: {
      // '...' keeps the default JS minifier, then CSS is minified too
      minimizer: ['...', new CssMinimizerPlugin()]
    },

    // Dev server (npm start). Files are served from memory, not from dist
    devServer: {
      port: 9000,
      open: true, // Open the browser automatically
      compress: true,
      hot: true, // Update styles without reloading the page
      static: false, // Everything comes from the webpack build
      watchFiles: ['src/**/*.html'], // Reload the page when html changes
      client: {
        overlay: true // Show errors and warnings in the browser
      }
    }
  }
}
