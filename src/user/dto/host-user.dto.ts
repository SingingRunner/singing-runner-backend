import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ObjectType("HostUserOutput")
@InputType("HostUserInput")
export class HostUserDto {
  constructor(userId: string, nickname: string) {
    this.userId = userId;
    this.nickname = nickname;
  }

  @IsNotEmpty()
  @Field(() => String)
  private userId: string;

  @IsNotEmpty()
  @Field(() => String)
  private nickname: string;

  public getUserId(): string {
    return this.userId;
  }

  public getNickname(): string {
    return this.nickname;
  }
}
