import { userActiveStatus, userKeynoteStatus } from "../util/user.enum";
import { IsNotEmpty } from "@nestjs/class-validator";

export class UserMatchDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  userMmr: number;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  userActive: userActiveStatus;

  @IsNotEmpty()
  userKeynote: userKeynoteStatus;

  @IsNotEmpty()
  character: string;
}
