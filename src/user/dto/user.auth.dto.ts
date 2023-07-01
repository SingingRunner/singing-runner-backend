import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserAuthDto {
  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  password: string;
}
