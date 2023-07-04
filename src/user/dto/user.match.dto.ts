import { UserActiveStatus, UserKeynoteStatus } from "../util/user.enum";
import { IsNotEmpty } from "@nestjs/class-validator";

export class UserMatchDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  userMmr: number;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  userActive: UserActiveStatus;

  @IsNotEmpty()
  userKeynote: UserKeynoteStatus;

  @IsNotEmpty()
  character: string;
}
