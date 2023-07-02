// GoogleUserRegisterDto
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GoogleUserRegisterDto {
  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  nickname: string;
}
