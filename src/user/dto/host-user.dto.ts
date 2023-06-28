import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@ObjectType("HostUserOutput")
@InputType("HostUserInput")
export class HostUserDto {
  @IsNotEmpty()
  @Field(() => String)
  public userId: string;

  @IsNotEmpty()
  @Field(() => String)
  public nickname: string;
}
