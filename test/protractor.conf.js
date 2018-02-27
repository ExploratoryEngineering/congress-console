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

const port = 19876;

exports.config = {
    baseUrl: `http://localhost:${port}/`,
    port: port,

    // use `npm run e2e`
    specs: [
        "e2e/**/*.e2e.ts"
    ],
    exclude: [],

    framework: "jasmine",

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
        "browserName": "chrome",
        "chromeOptions": {
            "args": ["show-fps-counter=true", "--no-sandbox", "--headless", "--disable-gpu"]
        }
    },

    onPrepare: function () {
        require("ts-node").register({ compilerOptions: { module: "commonjs" }, disableWarnings: true, fast: true });
    },

    plugins: [{
        package: "aurelia-protractor-plugin"
    }]
};
