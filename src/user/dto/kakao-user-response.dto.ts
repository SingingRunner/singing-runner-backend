import { Field, InputType } from "@nestjs/graphql";

@InputType()
class KakaoAccount {
  @Field(() => String)
  email: string;
}

@InputType()
export class KakaoUserResponseDto {
  @Field(() => String)
  id: string;

  @Field(() => KakaoAccount)
  kakao_account: KakaoAccount;
}
