export class ToIntValueConverter {
  fromView(inputString) {
    if (inputString) {
      try {
        return parseInt(inputString, 10);
      } catch (e) {
        return 0;
      }
    } else {
      return 0;
    }
  }
}
