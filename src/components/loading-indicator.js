import { bindable, noView } from 'aurelia-framework';

import '../../node_modules/nprogress/nprogress.css';
import NProgress from 'nprogress';

// Simple config
NProgress.configure({
  showSpinner: false,
  easing: 'ease',
  speed: 500
});

@noView()
export class LoadingIndicator {
  @bindable loading = false;

  loadingChanged(isLoading) {
    console.log('LoadingIndicator: IsLoading ', isLoading);
    if (isLoading) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }
}
