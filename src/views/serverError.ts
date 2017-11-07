import { autoinject } from "aurelia-framework";
import { Router } from "aurelia-router";

@autoinject
export class ServerError {
  constructor(private router: Router) { }

  navigateBack() {
    this.router.navigateBack();
  }
}
