import { SortValueConverter } from './sort';

const sort = new SortValueConverter();

describe('Sort value converter', () => {
  describe('sorting numbers', () => {
    it('should correctly sort a list of object with numbers', () => {
      let unSortedList = [{
        num: 3
      }, {
        num: 1
      }, {
        num: 2
      }];

      expect(sort.toView(unSortedList, 'num')).toEqual([
        { num: 1 }, { num: 2 }, { num: 3 }
      ]);
    });

    it('should correctly sort a slist of object with numbers descendingly if provided with desc', () => {
      let unSortedList = [{
        num: 3
      }, {
        num: 1
      }, {
        num: 2
      }];

      expect(sort.toView(unSortedList, 'num', 'desc')).toEqual([
        { num: 3 }, { num: 2 }, { num: 1 }
      ]);
    });
  });
  describe('sorting strings', () => {
    it('should correctly sort a list of objects with strings', () => {
      let unSortedList = [{
        str: '3'
      }, {
        str: '1'
      }, {
        str: '2'
      }];

      expect(sort.toView(unSortedList, 'str')).toEqual([
        { str: '1' }, { str: '2' }, { str: '3' }
      ]);
    });

    it('should correctly sort a slist of object with strings descendingly if provided with desc', () => {
      let unSortedList = [{
        str: '3'
      }, {
        str: '1'
      }, {
        str: '2'
      }];

      expect(sort.toView(unSortedList, 'str', 'desc')).toEqual([
        { str: '3' }, { str: '2' }, { str: '1' }
      ]);
    });
  });

  describe('sorting exceptions', () => {
    it('should return the same order if the property types is not the same', () => {
      let unSortedList = [{
        str: 3
      }, {
        str: '1'
      }, {
        str: true
      }];

      expect(sort.toView(unSortedList, 'str')).toEqual([
        { str: 3 }, { str: '1' }, { str: true }
      ]);
    });
  });
});
