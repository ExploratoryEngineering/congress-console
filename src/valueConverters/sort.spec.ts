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

import { SortValueConverter } from "./sort";

const sort = new SortValueConverter();

describe("Sort value converter", () => {
  describe("deep nested variables", () => {
    it("should correctly be able to sort deep nested variables", () => {
      const unSortedList = [{
        num: { a: 3 },
      }, {
        num: { a: 1 },
      }, {
        num: { a: 2 },
      }];

      expect(sort.toView(unSortedList, "num.a")).toEqual([
        { num: { a: 1 } }, { num: { a: 2 } }, { num: { a: 3 } },
      ]);
    });
  });

  describe("sorting numbers", () => {
    it("should correctly sort a list of object with numbers", () => {
      const unSortedList = [{
        num: 3,
      }, {
        num: 1,
      }, {
        num: 2,
      }];

      expect(sort.toView(unSortedList, "num")).toEqual([
        { num: 1 }, { num: 2 }, { num: 3 },
      ]);
    });

    it("should correctly sort a slist of object with numbers descendingly if provided with desc", () => {
      const unSortedList = [{
        num: 3,
      }, {
        num: 1,
      }, {
        num: 2,
      }];

      expect(sort.toView(unSortedList, "num", "desc")).toEqual([
        { num: 3 }, { num: 2 }, { num: 1 },
      ]);
    });
  });
  describe("sorting strings", () => {
    it("should correctly sort a list of objects with strings", () => {
      const unSortedList = [{
        str: "3",
      }, {
        str: "1",
      }, {
        str: "2",
      }];

      expect(sort.toView(unSortedList, "str")).toEqual([
        { str: "1" }, { str: "2" }, { str: "3" },
      ]);
    });

    it("should correctly sort a slist of object with strings descendingly if provided with desc", () => {
      const unSortedList = [{
        str: "3",
      }, {
        str: "1",
      }, {
        str: "2",
      }];

      expect(sort.toView(unSortedList, "str", "desc")).toEqual([
        { str: "3" }, { str: "2" }, { str: "1" },
      ]);
    });
  });

  describe("sorting exceptions", () => {
    it("should return the same order if the property types is not the same", () => {
      const unSortedList = [{
        str: 3,
      }, {
        str: "1",
      }, {
        str: true,
      }];

      expect(sort.toView(unSortedList, "str")).toEqual([
        { str: 3 }, { str: "1" }, { str: true },
      ]);
    });

    it("should sort undefined values last", () => {
      const unSortedList = [{
        str: 3,
      }, {
        notStr: "1",
      }, {
        str: true,
      }];

      expect(sort.toView(unSortedList, "str")).toEqual([
        { str: 3 }, { str: true }, { notStr: "1" },
      ]);
    });
  });
});
