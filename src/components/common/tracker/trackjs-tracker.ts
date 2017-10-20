import { LogBuilder } from 'Helpers/LogBuilder';
interface TrackJs {
  track(errorMessage: string);
}

declare global {
  interface Window {
    trackJs: TrackJs;
  }
}

const Log = LogBuilder.create('TrackJs tracker');

export class TrackJsTracker {
  trackError(error: string) {
    this.getTrackJs().track(error);
  }

  getTrackJs(): TrackJs {
    let tempErrorFunc = {
      track: (errorString) => {
        Log.debug(`Would've sent error, but no TrackJs: ${errorString}`);
      }
    };
    return window.trackJs || tempErrorFunc;
  }
}
