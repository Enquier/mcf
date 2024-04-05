const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const configUtils = require('./app/lib/config-utils');
const validators = require('./app/ui/js/validators');

class WatchRunPlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.watchRun.tap('WatchRun', (comp) => {
      if (comp.modifiedFiles) {
        const changedFiles = Array.from(comp.modifiedFiles, (file) => `\n  ${file}`).join('');
        console.log('');
        console.log('===============================');
        console.log('FILES CHANGED:', changedFiles);
        console.log('===============================');
      }
      if (comp.removedFiles) {
        const changedFiles = Array.from(comp.removedFiles, (file) => `\n  ${file}`).join('');
        console.log('');
        console.log('===============================');
        console.log('FILES REMOVED:', changedFiles);
        console.log('===============================');
      }
    });
  }
}

class SetupPlugin {
  constructor() {
    this.ran = false;
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.beforeCompile.tap('Setup', async () => {
      if (this.ran) {
        return;
      }
      this.ran = true;

      // Initialize the build directory
      if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
      }

      // Set configuration file path
      const configPath = path.join(__dirname, 'config', `${process.env.MBEE_ENV}.cfg`);
      // Read configuration file
      const configContent = fs.readFileSync(configPath).toString();
      // Remove comments from configuration string
      const stripComments = configUtils.removeComments(configContent);
      // Parse configuration string into JSON object
      const config = JSON.parse(stripComments);
      // Parse custom validator regex
      configUtils.parseRegEx(config);

      // Initialize validator directory
      const validatorsDir = path.join(__dirname, 'build', 'json');
      if (!fs.existsSync(validatorsDir)) {
        // Make validators directory
        fs.mkdirSync(validatorsDir);
      }

      const artifactValidators = config.artifact.customValidators;
      const { customValidators } = config;
      const _validators = validators.run(customValidators, artifactValidators);

      // Import validator object into validators file
      fs.writeFileSync(path.join(validatorsDir, 'validators.json'), JSON.stringify(_validators), 'utf8');

      // Store UI Login Modal
      fs.writeFileSync(path.join(validatorsDir, 'uiConfig.json'), JSON.stringify(config.server.ui), 'utf8');
    });
  }
}
module.exports = (env, argv) => ({
  mode: argv.mode,
  entry: {
    main: path.join(__dirname, 'app', 'ui', 'components', 'Index.jsx'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'js/[name].bundle.js',
    assetModuleFilename: '[name][ext]',
    publicPath: '',
  },
  optimization: {
    minimize: argv.mode === 'production',
    moduleIds: 'named',
    splitChunks: {
        chunks: 'all'
    }
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 300,
    ignored: ['**/node_modules/', '**/ckeditor-dev', '**/src/ve-experimental/index.ts'],
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    // Add '.jsx' and '.tsx' as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.jsx', '.json', '.js'],
    // alias: hq.get('webpack'),
    // alias: {
    //     buffer: 'buffer',
    // },
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 300,
    ignored: ['**/node_modules', '**/build'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/transform-runtime'],
          sourceMap: true,
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'resolve-url-loader',
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      {
        test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'webfonts/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new WatchRunPlugin(),
    new SetupPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'app', 'ui', 'html', 'index_template.html'),
      filename: path.join(__dirname, 'build', 'index.html'),
    }),
    // new FaviconsWebpackPlugin({
    //   logo: path.resolve(
    //     __dirname,
    //     'app/ui/icon/favicon.ico',
    //   ),
    //   prefix: '',
    //   publicPath: './img',
    //   outputPath: path.resolve(__dirname, 'build/img'),
    //   inject: true,
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css',
    }),
  ],
});
