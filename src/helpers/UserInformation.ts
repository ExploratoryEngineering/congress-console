import Cookies from 'js-cookie';

import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('UserInformation');

export default class UserInformation {
  static LOGGED_IN_COOKIE_NAME = 'loggedIn';
  static state = {
    isLoggedIn: false
  };

  static isLoggedIn() {
    Log.debug('Userinformation checking is loggedIn');
    this.refreshLoggedIn();
    return this.state.isLoggedIn;
  }

  static refreshLoggedIn() {
    this.state.isLoggedIn = !!Cookies.get(this.LOGGED_IN_COOKIE_NAME);
  }

  // Debug
  static setLoggedIn(loggedIn) {
    if (loggedIn) {
      Cookies.set(this.LOGGED_IN_COOKIE_NAME, loggedIn);
    } else {
      Cookies.remove(this.LOGGED_IN_COOKIE_NAME);
    }
    this.refreshLoggedIn();
  }
}
