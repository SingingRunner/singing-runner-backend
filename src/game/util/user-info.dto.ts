export class UserInfoDto {
  private userId: string;
  private nickname: string;

  constructor($userId: string, $nickname: string) {
    this.userId = $userId;
    this.nickname = $nickname;
  }
}
