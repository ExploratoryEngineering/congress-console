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

import { TagListValueConverter } from "valueConverters/tagList";

const tagList = new TagListValueConverter();

describe("Tag list value converter", () => {
  it("should correctly return tags based on tag entity", () => {
    const tagEntity: TagEntity = {
      tags: {
        name: "testname",
      },
    };

    expect(tagList.toView(tagEntity.tags)).toContainEqual({
      key: "name",
      value: "testname",
    });
  });

  it("should correctly exclude tags based on filter", () => {
    const tagEntity: TagEntity = {
      tags: {
        name: "testname",
      },
    };

    expect(tagList.toView(tagEntity.tags, ["name"])).not.toContainEqual({
      key: "name",
      value: "testname",
    });
  });
});
