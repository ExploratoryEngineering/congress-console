/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
import '../styles/styles.less';

import { LogManager, Aurelia, PLATFORM } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';

// Promise polyfill
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .plugin(PLATFORM.moduleName('aurelia-google-maps'), config => {
      config.options({
        apiKey: 'AIzaSyBfrbnOsPYJwccsvXrIkBHs7bUIYp8EaF0',
        apiLibraries: 'drawing,geometry',
        options: { panControl: true, panControlOptions: { position: 9 } }
      });
    })
    .plugin(PLATFORM.moduleName('aurelia-configuration'), config => {
      config.setEnvironments({
        development: ['localhost', 'lora.localhost'],
        staging: ['lora.engineering'],
        production: ['lora.telenor.io']
      });

      LogManager.addAppender(new ConsoleAppender());
      if (config.is('production')) {
        LogManager.setLevel(LogManager.logLevel.error);
      } else {
        LogManager.setLevel(LogManager.logLevel.debug);
      }
    });

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  await aurelia.start();
  aurelia.setRoot(PLATFORM.moduleName('app'));

  document.addEventListener('aurelia-composed', () => {
    const splash = document.getElementsByClassName('splash-container')[0];
    splash.className += ' splash-container--fade-out';
    setTimeout(() => {
      const parent = splash.parentElement;
      if (parent) {
        parent.removeChild(splash);
      }
    }, 450);
  });

  // if you would like your website to work offline (Service Worker),
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}
