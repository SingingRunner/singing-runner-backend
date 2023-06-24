import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserKeynoteResponseDto {
  @Field(() => String)
  userId: string;

  @Field(() => Int)
  userKeynote: number;
}
