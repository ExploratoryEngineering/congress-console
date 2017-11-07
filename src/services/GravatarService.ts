import md5 from "blueimp-md5";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Gravatar service");

export class GravatarService {
  getImageSrcByEmail(email: string): string {
    Log.debug("Fetching data from gravatar for email", email);
    return `https://secure.gravatar.com/avatar/${md5(email)}?d=mm`;
  }
}
