import { Field, ObjectType } from "@nestjs/graphql";
import { characterEnum } from "./character.enum";

@ObjectType()
export class UserCharacterResponse {
  @Field()
  userId: string;

  @Field(() => characterEnum)
  character: characterEnum;
}
