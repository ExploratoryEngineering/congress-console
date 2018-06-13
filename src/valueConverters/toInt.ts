export class ToIntValueConverter {
  fromView(inputString) {
    if (inputString) {
      try {
        const parsedNumber = parseInt(inputString, 10);
        if (Number.isNaN(parsedNumber)) {
          return 0;
        }
        return parsedNumber;
      } catch (e) {
        return 0;
      }
    } else {
      return 0;
    }
  }
}
