export default class Debug {
  /**
   * Returns a random number
   * @param {number} length Optional. The maximum value of the random number
   */
  static getRandomNumber(length: number = 1000000000): number {
    return Math.floor(Math.random() * length);
  }

  /**
   * Returns an array of random numbers
   * @param {number} arraySize Optional. Length of array
   * @param {number} length Optional. The maximum value of the random number
   */
  static getRandomArray(arraySize: number = 20, length: number = 1000000000): number[] {
    let randomArray: number[] = [];

    for (let i = 0; i < arraySize; i += 1) {
      randomArray.push(Debug.getRandomNumber(length));
    }

    return randomArray;
  }

  /**
   * Returns a random hex shaped string
   * @param {number} [hexSize=8] Optional. Length of hex
   * @param {boolean} [dashes=true] Optional. Use dashes as a separator
   */
  static getRandomHexString(hexSize: number = 8, dashes: boolean = true): string {
    let hexString = '';

    for (let i = 0; i < hexSize; i += 1) {
      hexString += (dashes && hexString ? '-' : '') + Debug.getRandomNumber(10) + Debug.getRandomNumber(10);
    }

    return hexString;
  }
}

