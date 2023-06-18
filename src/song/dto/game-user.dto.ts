import { PartialType } from "@nestjs/mapped-types";
import { IsEnum } from "class-validator";
import { UserRepository } from "src/user/repository/user.repository";
import { userKeynoteStatus } from "src/user/util/user.enum";

export class GameUserDto extends PartialType(UserRepository) {
  @IsEnum(userKeynoteStatus)
  uerKeynote: userKeynoteStatus;
}
