import { StringifyValueConverter } from './stringify';

const stringify = new StringifyValueConverter();

describe('Stringify value converter', () => {
  it('should correctly stringify an object', () => {
    const testObj = {
      test: 123
    };

    expect(stringify.toView(testObj)).toBe(JSON.stringify(testObj, null, 2));
  });

  it('should correctly override indenting if provided', () => {
    const testObj = {
      test: 123
    };

    expect(stringify.toView(testObj, 3)).toBe(JSON.stringify(testObj, null, 3));
  });

  it('should correctly return the same string if argument is string', () => {
    const testString = 'mystring';

    expect(stringify.toView(testString)).toBe(testString);
  });
});
