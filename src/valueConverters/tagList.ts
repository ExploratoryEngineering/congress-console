import { TagHelper } from "Helpers/TagHelper";

const th = new TagHelper();

export class TagListValueConverter {
  toView(tagObject: TagObject, exclude: string[] = [""]): Tag[] {
    return th.getTagsFromObject(tagObject).filter((tag) => {
      return !exclude.includes(tag.key);
    });
  }
}
