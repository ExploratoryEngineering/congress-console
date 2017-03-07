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
  connectId: string;
  name: string;
  locale: string;
  email: string;
  verifiedEmail: boolean;
  phone: string;
  verifiedPhone: boolean;

  constructor({
    connectdId = '',
    name = '',
    locale = 'en',
    email = '',
    verifiedEmail = false,
    phone = '',
    verifiedPhone = false
  } = {}) {
    this.connectId = connectdId;
    this.name = name;
    this.locale = locale;
    this.email = email;
    this.verifiedEmail = verifiedEmail;
    this.phone = phone;
    this.verifiedPhone = verifiedPhone;
  }

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
      verifiedPhone: dto.verified_phone
    });
  }
}
