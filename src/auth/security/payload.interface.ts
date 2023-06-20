import { characterEnum } from '../user/util/character.enum';

export interface Payload {
  userId: string;
  userEmail: string;
  nickname: string;
  userActive: boolean;
  userKeynote: boolean;
  userMmr: number;
  userPoint: number;
  character: characterEnum;
}
