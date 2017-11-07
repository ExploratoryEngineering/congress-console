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
