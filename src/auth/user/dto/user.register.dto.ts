import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserRegisterDto {
  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  nickname: string;
}
