/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

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
    const randomArray: number[] = [];

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
    let hexString = "";

    for (let i = 0; i < hexSize; i += 1) {
      hexString += (dashes && hexString ? "-" : "") + Debug.getRandomNumber(10) + Debug.getRandomNumber(10);
    }

    return hexString;
  }
}
