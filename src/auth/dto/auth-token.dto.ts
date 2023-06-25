import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthTokenDto {
  @Field(() => String)
  accessToken: string;
}
