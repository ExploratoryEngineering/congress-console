import '../styles/styles.less';

import { LogManager } from 'aurelia-framework';
import { ConsoleAppender } from 'aurelia-logging-console';

// Promise polyfill
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia) {
  LogManager.addAppender(new ConsoleAppender());

  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-dialog')
    .plugin('aurelia-configuration', config => {
      config.setEnvironments({
        development: ['localhost', 'lora.localhost'],
        staging: ['lora.engineering'],
        production: ['lora.telenor.io']
      });

      if (config.is('production')) {
        LogManager.setLevel(LogManager.logLevel.error);
      } else {
        LogManager.setLevel(LogManager.logLevel.debug);
      }
    });

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  await aurelia.start();
  aurelia.setRoot('app');

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
