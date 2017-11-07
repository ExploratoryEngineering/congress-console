import { computedFrom } from "aurelia-binding";
import { bindable, bindingMode } from "aurelia-framework";

import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Pagination");

export class Pagination {
  @bindable
  collection: any[] = [];
  @bindable
  rowsPrPage: string = "10";
  availableRowsPrPage = [
    10,
    25,
    100,
  ];
  @bindable
  offset: number = 0;
  filteredCollection: any[] = [];

  @bindable
  filterCallback;

  filter() {
    const collection = [...this.collection];
    Log.debug("filtering");
    this.filteredCollection = collection.splice(parseInt(this.rowsPrPage, 10) * this.offset, parseInt(this.rowsPrPage, 10));
    this.filterCallback({
      filteredCollection: this.filteredCollection,
    });
  }

  /**
   * Set page number for collection
   * @param pageNumber Page number 0-indexed
   */
  setPageNumber(pageNumber: number) {
    this.offset = pageNumber;
  }

  increasePageNumber() {
    Log.debug("Increase page number", (parseInt(this.rowsPrPage, 10) * (this.offset + 1)));
    if (this.collection.length - (parseInt(this.rowsPrPage, 10) * (this.offset + 1)) > 0) {
      this.offset += 1;
    }
  }

  decreasePageNumber() {
    Log.debug("Decrease page number");
    if (this.offset - 1 >= 0) {
      this.offset -= 1;
    }
  }

  setRowsPrPage(rowsPrPage: string) {
    this.rowsPrPage = rowsPrPage;
  }

  @computedFrom("filteredCollection")
  get rowData(): string {
    return `${this.getFromRange()} - ${this.getToRange()} of ${this.collection.length}`;
  }

  getFromRange(): number {
    return (this.offset * parseInt(this.rowsPrPage, 10) + 1);
  }

  getToRange(): number {
    return (this.offset * parseInt(this.rowsPrPage, 10)) + this.filteredCollection.length;
  }

  bind() {
    this.filter();
  }

  collectionChanged() {
    this.filter();
  }
  rowsPrPageChanged() {
    this.offset = 0;
    this.filter();
  }
  offsetChanged() {
    this.filter();
  }
}
