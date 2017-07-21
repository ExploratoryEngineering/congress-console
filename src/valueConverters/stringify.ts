export class StringifyValueConverter {
  toView(obj, indenting: number = 2) {
    if (typeof obj === 'string') {
      return obj;
    } else {
      return JSON.stringify(obj, null, indenting);
    }
  }
}
