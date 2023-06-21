import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserLoginDto {
  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  password: string;
}
