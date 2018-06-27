/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
import "../styles/styles.scss";

import { Aurelia, LogManager } from "aurelia-framework";
import { ConsoleAppender } from "aurelia-logging-console";
import { PLATFORM } from "aurelia-pal";

// Promise polyfill
import * as Bluebird from "bluebird";
Bluebird.config({ warnings: false });

export async function configure(aurelia: Aurelia) {
  LogManager.addAppender(new ConsoleAppender());
  if (PRODUCTION) {
    LogManager.setLevel(LogManager.logLevel.error);
  } else {
    LogManager.setLevel(LogManager.logLevel.debug);
  }

  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName("components/index"))
    .plugin(PLATFORM.moduleName("aurelia-dialog"), (config) => {
      config.useDefaults();
      config.settings.keyboard = true;
      config.settings.overlayDismiss = true;
    })
    .plugin(PLATFORM.moduleName("aurelia-google-maps"), (config) => {
      config.options({
        apiKey: GOOGLE_MAPS_KEY,
        apiLibraries: "drawing,geometry",
        options: { panControl: true, panControlOptions: { position: 9 } },
      });
    });

  await aurelia.start();
  aurelia.setRoot(PLATFORM.moduleName("app"));

  document.addEventListener("aurelia-composed", () => {
    const splash = document.getElementsByClassName("splash-container")[0];
    splash.className += " splash-container--fade-out";
    setTimeout(() => {
      const parent = splash.parentElement;
      if (parent) {
        parent.removeChild(splash);
      }
    }, 450);
  });
}
