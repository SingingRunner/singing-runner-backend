import { characterEnum } from "../../user/util/character.enum";

export interface Payload {
  userId: string;
  userEmail: string;
  nickname: string;
  userActive: number;
  userKeynote: number;
  userMmr: number;
  userPoint: number;
  character: characterEnum;
}
