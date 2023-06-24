export class UserInfoDto {
  private userId: string;
  private nicknam: string;

  constructor($userId: string, $nicknam: string) {
    this.userId = $userId;
    this.nicknam = $nicknam;
  }
}
