import { bindable, noView } from "aurelia-framework";

import * as NProgress from "nprogress";
import "nprogress/nprogress.css";
import "./loading-indicator.scss";

import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("LoadingIndicator");

// Simple config
NProgress.configure({
  showSpinner: false,
  easing: "ease",
  speed: 200,
});

@noView()
export class LoadingIndicator {
  @bindable loading = false;

  loadingChanged(isLoading) {
    Log.debug("IsLoading ", isLoading);
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }
}
