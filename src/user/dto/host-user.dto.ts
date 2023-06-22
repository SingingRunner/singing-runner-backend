import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class HostUserDto {
  constructor(userId: string, nickname: string) {
    this.userId = userId;
    this.nickname = nickname;
  }

  @IsNotEmpty()
  @Field()
  private userId: string;

  @IsNotEmpty()
  @Field()
  private nickname: string;

  @Field()
  public getUserId(): string {
    return this.userId;
  }

  @Field()
  public getNickname(): string {
    return this.nickname;
  }
}
