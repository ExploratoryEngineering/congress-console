export default class Debug {
  static getRandomNumber(length = 1000000000) {
    return Math.floor(Math.random() * length);
  }

  static getRandomArray(arraySize = 20, length = 1000000000) {
    let randomArray = [];

    for (let i = 0; i < arraySize; i += 1) {
      randomArray.push(Debug.getRandomNumber(length));
    }

    return randomArray;
  }

  static getRandomHexString(hexSize = 8, dashes = true) {
    let hexString = '';

    for (let i = 0; i < hexSize; i += 1) {
      hexString += (dashes && hexString ? '-' : '') + Debug.getRandomNumber(10) + Debug.getRandomNumber(10);
    }

    return hexString;
  }
}

