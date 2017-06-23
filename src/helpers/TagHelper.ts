import { LogBuilder } from 'Helpers/LogBuilder';

const Log = LogBuilder.create('TagHelper');

export class TagHelper {
  TAG_NAME_KEY = 'name';
  TAG_NAME_FALLBACK_VALUE = 'Unnamed';

  TAG_DESCRIPTION_KEY = 'description';
  TAG_DESCRIPTION_FALLBACK_VALUE = 'No description';

  /**
   * Returns either the name in tagcollection, fallbackKey or lastly
   * the FALLBACK_VALUE for name
   *
   * @param entity Entity with tags available
   * @param fallbackKey The key of the entity to use as fallback
   */
  getEntityName(entity: TagEntity, fallbackKey: string = ''): string {
    return this.getTagOrFallback(
      entity,
      this.TAG_NAME_KEY,
      fallbackKey,
      this.TAG_NAME_FALLBACK_VALUE
    );
  }

  /**
   * Returns either the description in tagcollection, fallbackKey or lastly
   * the FALLBACK_VALUE for description
   *
   * @param entity Entity with tags available
   * @param fallbackKey The key of the entity to use as fallback
   */
  getEntityDescription(entity: TagEntity, fallbackKey: string = ''): string {
    return this.getTagOrFallback(
      entity,
      this.TAG_DESCRIPTION_KEY,
      fallbackKey,
      this.TAG_DESCRIPTION_FALLBACK_VALUE
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
    return Object.keys(tagObject).map(key => {
      return {
        key: key,
        value: tagObject[key]
      };
    });
  }

  /**
   * Parse a string to a tag
   * @param tagString String to be parsed to tag
   */
  parseStringToTag(tagString: string): Tag {
    let pieces = tagString.split(':');

    let key = pieces.splice(0, 1)[0];
    let value = pieces.join(':');

    return {
      key: key,
      value: value
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
