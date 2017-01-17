import 'whatwg-fetch';
import '../styles/styles.less';

// Promise polyfill
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-dialog');


  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')

  await aurelia.start();
  aurelia.setRoot('app');

  document.addEventListener('aurelia-composed', () => {
    const splash = document.getElementsByClassName('splash-container')[0];
    splash.className += ' splash-container--fade-out';
    setTimeout(() => {
      splash.remove();
    }, 450);
  });

  // if you would like your website to work offline (Service Worker),
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
}
