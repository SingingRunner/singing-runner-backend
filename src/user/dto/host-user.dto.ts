import { IsNotEmpty } from "class-validator";

export class HostUserDto {
  constructor(userId: string, nickname: string) {
    this.userId = userId;
    this.nickname = nickname;
  }

  @IsNotEmpty()
  private userId: string;

  @IsNotEmpty()
  private nickname: string;

  public getUserId(): string {
    return this.userId;
  }

  public getNickname(): string {
    return this.nickname;
  }
}
