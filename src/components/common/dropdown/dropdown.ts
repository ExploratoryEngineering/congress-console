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

import { bindable } from "aurelia-framework";

export class Dropdown {
  @bindable
  active = false;
  @bindable
  dropdownPosition: string = "above";
  @bindable
  containerClasses: string = "";
  @bindable
  disabled: boolean = false;

  dropdown: HTMLDivElement;
  container: HTMLDivElement;
  closeOnItemSelect = true;
  closeOnOutsideClick = true;

  constructor() {
    this.handleDropdownClick = (e) => {
      if (this.closeOnItemSelect) {
        this.closeDropdown();
      }
    };
    this.handleBodyClick = (e) => {
      if (this.closeOnOutsideClick &&
        this.container &&
        !this.container.contains(e.target)) {
        this.closeDropdown();
      }
    };
  }

  handleDropdownClick = (event) => { return; };
  handleBodyClick = (event) => { return; };

  toggleDropdown() {
    if (this.disabled) {
      this.active = false;
    } else {
      this.active = !this.active;
    }
  }

  attached() {
    this.container.addEventListener("click", this.handleDropdownClick);
  }

  detached() {
    this.container.removeEventListener("click", this.handleDropdownClick);
  }

  closeDropdown() {
    this.active = false;
  }

  activeChanged(isActive) {
    if (isActive) {
      window.document.addEventListener("click", this.handleBodyClick);
    } else {
      window.document.removeEventListener("click", this.handleBodyClick);
    }
  }
}
