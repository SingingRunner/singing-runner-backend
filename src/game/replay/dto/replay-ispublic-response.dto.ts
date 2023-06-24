import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ReplayIsPublicResponseDto {
  @Field(() => String)
  replayId: number;

  @Field(() => Int)
  isPublic: number;
}
