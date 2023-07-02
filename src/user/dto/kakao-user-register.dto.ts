import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class KakaoUserRegisterDto {
  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  nickname: string;
}
