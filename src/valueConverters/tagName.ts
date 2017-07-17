import { TagHelper } from 'Helpers/TagHelper';

const th = new TagHelper();

/**
 * Simple value converter to map from a potential name in tag with fallback
 */
export class TagNameValueConverter {
  toView(entity: TagEntity, fallbackKey: string) {
    if (!entity) {
      return '';
    }
    return th.getEntityName(entity, fallbackKey);
  }
}
