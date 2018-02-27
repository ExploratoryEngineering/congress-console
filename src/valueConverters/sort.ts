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

import { LogBuilder } from "Helpers/LogBuilder";
const Log = LogBuilder.create("sort");

export class SortValueConverter {
  toView(array, propertyName: string, direction: string = "asc") {
    const factor = direction === "asc" ? 1 : -1;
    return array
      .slice(0)
      .sort((a, b) => {
        const aProp = this.getProp(a, propertyName);
        const bProp = this.getProp(b, propertyName);
        if (typeof aProp === "string" && typeof bProp === "string") {
          return aProp.localeCompare(bProp) * factor;
        }
        if (typeof aProp === "number" && typeof bProp === "number") {
          return (aProp - bProp) * factor;
        }
        Log.warn(`Tried to sort property ${propertyName} which wasnt same type`, aProp, typeof aProp, bProp, typeof bProp);

        if (typeof aProp === "undefined" && typeof bProp !== "undefined") {
          return 1;
        } else if (typeof bProp === "undefined" && typeof aProp !== "undefined") {
          return -1;
        } else {
          return 0;
        }
      });
  }

  private getProp(element: any, property: string): any {
    const pieces = property.split(".");
    let tempEl = { ...element };

    pieces.forEach((piece) => {
      try {
        tempEl = tempEl[piece];
      } catch {
        Log.warn(`Piece ${piece} was not found on ${tempEl}`);
        return;
      }
    });

    return tempEl;
  }
}
