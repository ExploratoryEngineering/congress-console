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
import { TagHelper } from "Helpers/TagHelper";

const th = new TagHelper();
const Log = LogBuilder.create("Tag name");

/**
 * Simple value converter to map from a potential name in tag with fallback
 */
export class TagNameValueConverter {
  toView(entity: TagEntity, fallbackKey: string) {
    if (!entity) {
      Log.warn("Tried to find name of falsey value");
      return "";
    }
    return th.getEntityName(entity, fallbackKey);
  }
}
