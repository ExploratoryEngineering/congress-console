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

import { DateFormatValueConverter } from "./dateFormat";

const dateFormat = new DateFormatValueConverter();

describe("Dateformat value converter", () => {
  const firstOfApril = "1490997600000";
  const illegalDate = "abc";

  it("should return the default format if given correct date but no format", () => {
    expect(dateFormat.toView(firstOfApril)).not.toBe("Invalid date");
  });

  it("should return the given format if given correct date and format", () => {
    expect(dateFormat.toView(firstOfApril, "YYYY")).toBe("2017");
  });

  it("should show a error message if the given value is illegal", () => {
    expect(dateFormat.toView(illegalDate)).toBe("Invalid date");
  });
});
