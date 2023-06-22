import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/user/entity/user.entity";

@ObjectType()
export class AuthDto {
  @Field(() => String)
  accessToken: string;

  @Field(() => User)
  user: User;
}
