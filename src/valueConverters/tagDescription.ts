import { TagHelper, TagEntity } from 'Helpers/TagHelper';

const th = new TagHelper();

/**
 * Simple value converter to map from a potential description in tag with fallback
 */
export class TagDescriptionValueConverter {
  toView(entity: TagEntity, fallbackKey: string) {
    return th.getEntityDescription(entity, fallbackKey);
  }
}
