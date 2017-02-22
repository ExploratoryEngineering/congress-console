import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@autoinject
export class NotFound {
  constructor(private router: Router) {

  }

  navigateBack() {
    this.router.navigateBack();
  }
}
