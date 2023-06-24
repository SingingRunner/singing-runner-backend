import { Field, ObjectType } from "@nestjs/graphql";
import { characterEnum } from "../util/character.enum";

@ObjectType()
export class UserCharacterResponseDto {
  @Field()
  userId: string;

  @Field(() => characterEnum)
  character: characterEnum;
}
