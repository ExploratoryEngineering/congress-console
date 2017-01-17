import { bindable } from 'aurelia-framework';

export class Dropdown {
  @bindable
  active = false;

  dropdown;
  container;
  closeOnItemSelect = true;
  closeOnOutsideClick = true;

  constructor() {
    this.handleDropdownClick = e => {
      if (this.closeOnItemSelect) {
        this.closeDropdown();
      }
    };
    this.handleBodyClick = e => {
      if (this.closeOnOutsideClick &&
        !this.container.contains(e.target)) {
        this.closeDropdown();
      }
    };
  }

  toggleDropdown() {
    this.active = !this.active;
  }

  attached() {
    this.container.addEventListener('click', this.handleDropdownClick);
  }

  detached() {
    this.container.removeEventListener('click', this.handleDropdownClick);
  }

  closeDropdown() {
    this.active = false;
  }

  activeChanged(isActive) {
    if (isActive) {
      window.document.addEventListener('click', this.handleBodyClick);
    } else {
      window.document.removeEventListener('click', this.handleBodyClick);
    }
  }
}
