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

interface UserProfileDto {
  connect_id: string;
  name: string;
  locale: string;
  email: string;
  verified_email: boolean;
  phone: string;
  verified_phone: boolean;
}

export class UserProfile {
  /**
   * Returns a new UserProfile from a dto
   */
  static newFromDto(dto: UserProfileDto): UserProfile {
    return new UserProfile({
      connectdId: dto.connect_id,
      name: dto.name,
      locale: dto.locale,
      email: dto.email,
      verifiedEmail: dto.verified_email,
      phone: dto.phone,
      verifiedPhone: dto.verified_phone,
    });
  }

  connectId: string;
  name: string;
  locale: string;
  email: string;
  verifiedEmail: boolean;
  phone: string;
  verifiedPhone: boolean;

  constructor({
    connectdId = "",
    name = "",
    locale = "en",
    email = "",
    verifiedEmail = false,
    phone = "",
    verifiedPhone = false,
  } = {}) {
    this.connectId = connectdId;
    this.name = name;
    this.locale = locale;
    this.email = email;
    this.verifiedEmail = verifiedEmail;
    this.phone = phone;
    this.verifiedPhone = verifiedPhone;
  }
}
