const path = require('path');
const appConfig = require('./config/config.json');
const { optimize: { CommonsChunkPlugin, ModuleConcatenationPlugin }, ProvidePlugin, ContextReplacementPlugin } = require('webpack');
const { AureliaPlugin } = require('aurelia-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');
const autoprefixer = require('autoprefixer');

// config helpers:
const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || [];
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig);

// primary config:
const title = 'Telenor LoRa';
const outDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const sassLoaderConfig = [{
  loader: 'css-loader', // translates CSS into CommonJS
  options: {
    sourceMap: true,
    importLoaders: 2
  }
}, {
  loader: 'postcss-loader', // adding needed prefixer for older browsers
  options: {
    plugins: () => [autoprefixer({ browsers: ['last 2 versions'] })],
    sourceMap: true,
    postcss: {}
  }
}, {
  loader: 'sass-loader', // compiles sass to CSS
  options: {
    sourceMap: true,
    includePaths: ['styles', 'node_modules/telenor-component-library']
  }
}];

module.exports = ({ production, server, extractCss, coverage } = {}) => ({
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [srcDir, 'node_modules'],
    alias: {
      Services: path.resolve(__dirname, 'src/services/'),
      Helpers: path.resolve(__dirname, 'src/helpers/'),
      Models: path.resolve(__dirname, 'src/models/'),
      Components: path.resolve(__dirname, 'src/components/'),
      Dialogs: path.resolve(__dirname, 'src/dialogs/'),
      'aurelia-pal': path.resolve('node_modules/aurelia-pal/dist/commonjs/aurelia-pal.js')
    }
  },
  devtool: production ? 'source-map' : 'cheap-module-eval-source-map',
  entry: {
    app: ['aurelia-bootstrapper'],
    vendor: ['bluebird', 'chart.js', 'moment']
  },
  output: {
    path: outDir,
    publicPath: baseUrl,
    filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
    sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
    chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
  },
  devServer: {
    contentBase: outDir,
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: sassLoaderConfig
      }, {
        test: /\.(scss|css)$/,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: extractCss ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: sassLoaderConfig
        }) : ['style-loader', ...sassLoaderConfig]
      },
      { test: /\.html$/i, loader: 'html-loader' },
      { test: /\.ts$/i, loader: 'awesome-typescript-loader', exclude: nodeModulesDir },
      { test: /\.json$/i, loader: 'json-loader' },
      // use Bluebird as the global Promise implementation:
      { test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/, loader: 'expose-loader?Promise' },
      // embed small images and fonts as Data Urls and larger ones as files:
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
      ...when(coverage, {
        test: /\.[jt]s$/i, loader: 'istanbul-instrumenter-loader',
        include: srcDir, exclude: [/\.{spec,test}\.[jt]s$/i],
        enforce: 'post', options: { esModules: true }
      })
    ]
  },
  plugins: [
    new AureliaPlugin({
      features: { svg: false, unparser: false, polyfills: 'es2015' }
    }),
    new ProvidePlugin({
      'Promise': 'bluebird'
    }),
    new TsConfigPathsPlugin(),
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      minify: production ? {
        removeComments: true,
        collapseWhitespace: true
      } : undefined,
      metadata: {
        // available in index.ejs //
        googleAnalytics: appConfig.googleAnalytics,
        trackJs: appConfig.trackJs,
        title,
        server,
        baseUrl,
        production
      }
    }),
    new ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
    new CopyWebpackPlugin([
      {
        from: 'favicon.png',
        to: 'favicon.png'
      },
      {
        from: 'images/',
        to: 'images/'
      },
      {
        from: 'config/',
        to: 'config/'
      }
    ]),
    ...when(extractCss, new ExtractTextPlugin({
      filename: production ? '[contenthash].css' : '[id].css',
      allChunks: true
    })),
    ...when(production, new CommonsChunkPlugin({
      name: 'common',
      minSize: 50
    })),
    ...when(production, new ModuleConcatenationPlugin())
  ]
});
