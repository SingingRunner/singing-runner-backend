import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserLoginDTO {
  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  password: string;
}
