import { isNotEmpty } from "class-validator";
import { userActiveStatus, userKeynoteStatus } from "../util/user.enum";
import { IsNotEmpty } from "@nestjs/class-validator";

export class UserMatchDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  userMMR: number;

  @IsNotEmpty()
  nickName: string;

  @IsNotEmpty()
  userActive: userActiveStatus;

  @IsNotEmpty()
  userKeynote: userKeynoteStatus;

  @IsNotEmpty()
  character: string;
}
