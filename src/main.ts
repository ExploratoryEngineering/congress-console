/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
import '../styles/styles.scss';

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
}
