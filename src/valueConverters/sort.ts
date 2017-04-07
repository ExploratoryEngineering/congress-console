import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('sort');

export class SortValueConverter {
  toView(array, propertyName, direction) {
    let factor = direction === 'asc' ? 1 : -1;
    return array
      .slice(0)
      .sort((a, b) => {
        let aProp = a[propertyName], bProp = b[propertyName];
        if (typeof aProp === 'string' && typeof bProp === 'string') {
          return aProp.localeCompare(bProp) * factor;
        }
        if (typeof aProp === 'number' && typeof bProp === 'number') {
          return (a - b) * factor;
        }
        Log.warn('Tried to sort values which wasnt same type', a, typeof a, b, typeof b);
        return 0;
      });
  }
}
