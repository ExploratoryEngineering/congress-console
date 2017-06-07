const port = 19876;

exports.config = {
  baseUrl: `http://localhost:${port}/`,
  port: port,

  // use `npm run e2e`
  specs: [
    'e2e/**/*.e2e.ts'
  ],
  exclude: [],

  framework: 'jasmine',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: true,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['show-fps-counter=true', '--no-sandbox', '--headless', '--disable-gpu']
    }
  },

  onPrepare: function() {
    require('ts-node').register({ compilerOptions: { module: 'commonjs' }, disableWarnings: true, fast: true });
  },

  plugins: [{
    package: 'aurelia-protractor-plugin'
  }]
};
