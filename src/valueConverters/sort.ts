import { LogBuilder } from 'Helpers/LogBuilder';
const Log = LogBuilder.create('sort');

export class SortValueConverter {
  toView(array, propertyName: string, direction: string = 'asc') {
    let factor = direction === 'asc' ? 1 : -1;
    return array
      .slice(0)
      .sort((a, b) => {
        let aProp = a[propertyName], bProp = b[propertyName];
        if (typeof aProp === 'string' && typeof bProp === 'string') {
          return aProp.localeCompare(bProp) * factor;
        }
        if (typeof aProp === 'number' && typeof bProp === 'number') {
          return (aProp - bProp) * factor;
        }
        Log.warn(`Tried to sort property ${propertyName} which wasnt same type`, aProp, typeof aProp, bProp, typeof bProp);
        return 0;
      });
  }
}
