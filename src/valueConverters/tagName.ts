import { TagHelper, TagEntity } from 'Helpers/TagHelper';

const th = new TagHelper();

/**
 * Simple value converter to map from a potential name in tag with fallback
 */
export class TagNameValueConverter {
  toView(entity: TagEntity, fallbackKey: string) {
    return th.getEntityName(entity, fallbackKey);
  }
}
