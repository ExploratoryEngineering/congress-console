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

const Log = LogBuilder.create("TagHelper");

export class TagHelper {
  TAG_NAME_KEY = "name";
  TAG_NAME_FALLBACK_VALUE = "Unnamed";

  TAG_DESCRIPTION_KEY = "description";
  TAG_DESCRIPTION_FALLBACK_VALUE = "No description";

  /**
   * Gets accepted regex for tag inputs for key and value.
   */
  getTagRegEx(): RegExp {
    return /^[a-zA-Z0-9_+,.\-:;\s]+$/;
  }

  /**
   * Returns either the name in tagcollection, fallbackKey or lastly
   * the FALLBACK_VALUE for name
   *
   * @param entity Entity with tags available
   * @param fallbackKey The key of the entity to use as fallback
   */
  getEntityName(entity: TagEntity, fallbackKey: string = ""): string {
    return this.getTagOrFallback(
      entity,
      this.TAG_NAME_KEY,
      fallbackKey,
      this.TAG_NAME_FALLBACK_VALUE,
    );
  }

  /**
   * Returns either the description in tagcollection, fallbackKey or lastly
   * the FALLBACK_VALUE for description
   *
   * @param entity Entity with tags available
   * @param fallbackKey The key of the entity to use as fallback
   */
  getEntityDescription(entity: TagEntity, fallbackKey: string = ""): string {
    return this.getTagOrFallback(
      entity,
      this.TAG_DESCRIPTION_KEY,
      fallbackKey,
      this.TAG_DESCRIPTION_FALLBACK_VALUE,
    );
  }

  getTagOrFallback(entity: TagEntity, tagKey: string, fallbackKey: string, fallback: string) {
    if (entity.tags[tagKey]) {
      return entity.tags[tagKey];
    } else {
      if (fallbackKey && entity[fallbackKey]) {
        return entity[fallbackKey];
      } else {
        return fallback;
      }
    }
  }

  /**
   * Utility function to create an array of Tags from a TagObject
   * @param tagObject TabObject to be tranformed
   */
  getTagsFromObject(tagObject: TagObject): Tag[] {
    return Object.keys(tagObject).map((key) => {
      return {
        key: key,
        value: tagObject[key],
      };
    });
  }

  /**
   * Parse a string to a tag
   * @param tagString String to be parsed to tag
   */
  parseStringToTag(tagString: string): Tag {
    const pieces = tagString.split(":");

    const key = pieces.splice(0, 1)[0];
    const value = pieces.join(":");

    return {
      key: key,
      value: value,
    };
  }

  /**
   * Parses a tag object to string
   * @param tag Tag to be parsed as string
   */
  parseTagToString(tag: Tag) {
    return `${tag.key}:${tag.value}`;
  }
}
