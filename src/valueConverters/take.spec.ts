import { TakeValueConverter } from './take';

const take = new TakeValueConverter();
const arrWith15 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

describe('Take value converter', () => {
  it('should return correct number of items in array upon take', () => {
    expect(take.toView(arrWith15, 5).length).toBe(5);
  });

  it('should return the whole array upon asking for more items than it has', () => {
    expect(take.toView(arrWith15, 25).length).toBe(15);
  });
});
