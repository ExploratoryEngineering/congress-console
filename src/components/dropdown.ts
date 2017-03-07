import { bindable } from 'aurelia-framework';

export class Dropdown {
  @bindable
  active = false;
  @bindable
  dropdownPosition: string = 'above';
  @bindable
  containerClass: string = '';

  dropdown;
  container;
  closeOnItemSelect = true;
  closeOnOutsideClick = true;

  handleDropdownClick = (event) => { };
  handleBodyClick = (event) => { };

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
