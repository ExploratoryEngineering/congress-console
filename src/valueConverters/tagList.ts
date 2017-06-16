import { TagHelper } from 'Helpers/TagHelper';

const th = new TagHelper;

export class TagListValueConverter {
  toView(tagObject: TagObject) {
    return th.getTagsFromObject(tagObject);
  }
}
