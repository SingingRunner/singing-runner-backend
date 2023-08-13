import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ReplayUserInfoDto {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  character: string;
}
