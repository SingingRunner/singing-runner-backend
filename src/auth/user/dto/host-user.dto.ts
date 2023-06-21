import { IsNotEmpty } from "class-validator";

export class HostUserDto {
  constructor(userId: string, nickName: string) {
    this.userId = userId;
    this.nickName = nickName;
  }

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  nickName: string;
}
