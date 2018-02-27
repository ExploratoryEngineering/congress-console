/*
	Copyright 2018 Telenor Digital AS

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

import md5 from "blueimp-md5";
import { LogBuilder } from "Helpers/LogBuilder";

const Log = LogBuilder.create("Gravatar service");

export class GravatarService {
  getImageSrcByEmail(email: string): string {
    Log.debug("Fetching data from gravatar for email", email);
    return `https://secure.gravatar.com/avatar/${md5(email)}?d=mm`;
  }
}
