export class TakeValueConverter {
  toView(array: any[], numberOfItems: number = 10) {
    return array.slice(0, numberOfItems);
  }
}
