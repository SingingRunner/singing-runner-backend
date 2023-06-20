import { IsNotEmpty } from "@nestjs/class-validator";

export class UserCharacterDto {
  constructor(userId: string, character: string) {
    this.userId = userId;
    this.character = character;
  }
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  character: string;
}
