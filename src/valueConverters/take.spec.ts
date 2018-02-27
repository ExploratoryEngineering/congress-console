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

import { TakeValueConverter } from "./take";

const take = new TakeValueConverter();
const arrWith15 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

describe("Take value converter", () => {
  it("should return correct number of items in array upon take", () => {
    expect(take.toView(arrWith15, 5).length).toBe(5);
  });

  it("should return the whole array upon asking for more items than it has", () => {
    expect(take.toView(arrWith15, 25).length).toBe(15);
  });
});
