import { TagHelper } from "Helpers/TagHelper";

const th = new TagHelper();

export class TagValueConverter {
  toView(tagObject: Tag) {
    return th.parseTagToString(tagObject);
  }
  fromView(tagString: string) {
    return th.parseStringToTag(tagString);
  }
}
