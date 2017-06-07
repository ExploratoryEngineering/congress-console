import { LogBuilder } from 'Helpers/LogBuilder';
import md5 from 'blueimp-md5';

const Log = LogBuilder.create('Gravatar service');

export class GravatarService {
  constructor() { }

  getImageSrcByEmail(email: string): string {
    Log.debug('Fetching data from gravatar for email', email);
    return `https://secure.gravatar.com/avatar/${md5(email)}?d=mm`;
  }
}
