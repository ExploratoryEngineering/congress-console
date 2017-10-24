import { TimeAgoValueConverter } from './timeAgo';

Date.now = jest.fn(() => 1490997600000);

const timeAgo = new TimeAgoValueConverter();

describe('TimeAgo value converter', () => {
  const firstOfApril = '1490997600000';
  const illegalDate = 'abc';

  it('should return the default format if given correct date but no format', () => {
    expect(timeAgo.toView(firstOfApril)).toBe('a few seconds ago');
  });

  it('should show a error message if the given value is illegal', () => {
    expect(timeAgo.toView(illegalDate)).toBe('Invalid date');
  });
});
