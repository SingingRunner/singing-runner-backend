// GoogleUserDto
import { Field, InputType } from "@nestjs/graphql";

@InputType()
class GoogleAccount {
  @Field(() => String)
  email: string;
}

@InputType()
export class GoogleUserResponseDto {
  @Field(() => String)
  googleId: string;

  @Field(() => GoogleAccount)
  google_account: GoogleAccount;
}
