import { Pagination } from "./pagination";

const arrayWith10 = new Array(10).fill("test");
const arrayWith3 = new Array(3).fill("test");

describe("Pagination", () => {
  let pagination: Pagination;
  beforeEach(() => {
    pagination = new Pagination();
    pagination.filterCallback = () => { return; };
    pagination.rowsPrPage = "5";
  });

  describe("basic functionality", () => {
    it("should correctly filter correct amount of devices based on ", () => {
      pagination.collection = arrayWith10;
      pagination.filter();

      expect(pagination.filteredCollection.length).toBe(5);
    });

    it("should call filter upon bind", () => {
      const spy = spyOn(pagination, "filter");
      pagination.bind();

      expect(spy).toHaveBeenCalled();
    });

    it("should call filterCallback upon filter", () => {
      const spy = spyOn(pagination, "filterCallback");
      pagination.filter();

      expect(spy).toHaveBeenCalled();
    });

    it("should show correct fromRange", () => {
      pagination.collection = arrayWith10;
      pagination.filter();

      expect(pagination.getFromRange()).toBe(1);
    });

    it("should show correct fromRange when paginated", () => {
      pagination.collection = arrayWith10;
      pagination.offset = 1;
      pagination.filter();

      expect(pagination.getFromRange()).toBe(6);
    });

    it("should show correct toRange", () => {
      pagination.collection = arrayWith10;
      pagination.filter();

      expect(pagination.getToRange()).toBe(5);
    });

    it("should show correct toRange when paginated", () => {
      pagination.collection = arrayWith10;
      pagination.offset = 1;
      pagination.filter();

      expect(pagination.getToRange()).toBe(10);
    });

    it("shoudl show correct toRange when limited data", () => {
      pagination.collection = arrayWith3;
      pagination.filter();

      expect(pagination.getToRange()).toBe(3);
    });
  });

  describe("previous/next", () => {
    it("should correctly allow for going to next page", () => {
      pagination.collection = arrayWith10;
      pagination.filter();

      expect(pagination.offset).toBe(0);
      pagination.increasePageNumber();
      expect(pagination.offset).toBe(1);
    });

    it("should correctly allow for going to previous page", () => {
      pagination.collection = arrayWith10;
      pagination.offset = 1;
      pagination.filter();

      expect(pagination.offset).toBe(1);
      pagination.decreasePageNumber();
      expect(pagination.offset).toBe(0);
    });

    it("should not allow for going to next page if there is no data", () => {
      pagination.rowsPrPage = "10";
      pagination.collection = arrayWith10;
      pagination.filter();
      expect(pagination.offset).toBe(0);
      pagination.increasePageNumber();
      expect(pagination.offset).toBe(0);
    });

    it("should correctly allow for going to previous page", () => {
      pagination.collection = arrayWith10;
      pagination.offset = 0;
      pagination.filter();

      expect(pagination.offset).toBe(0);
      pagination.decreasePageNumber();
      expect(pagination.offset).toBe(0);
    });
  });

  describe("on changed", () => {
    it("should call filter upon collectionChanged", () => {
      const spy = spyOn(pagination, "filter");
      pagination.collectionChanged();
      expect(spy).toHaveBeenCalled();
    });
  });

  it("should call filter upon rowsPrPageChanged", () => {
    const spy = spyOn(pagination, "filter");
    pagination.rowsPrPageChanged();
    expect(spy).toHaveBeenCalled();
  });

  it("should reset offset upon rowsPrPageChanged", () => {
    pagination.offset = 1;
    pagination.rowsPrPageChanged();

    expect(pagination.offset).toBe(0);
  });

  it("should call filter upon offsetChanged", () => {
    const spy = spyOn(pagination, "filter");
    pagination.offsetChanged();
    expect(spy).toHaveBeenCalled();
  });
});
