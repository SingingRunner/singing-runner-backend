import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserRegisterDto {
  @Field(() => String)
  userEmail: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String)
  nickname: string;
}
