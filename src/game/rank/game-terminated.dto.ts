import { Socket } from "socket.io";

export class GameTerminatedDto {
  constructor(userId: string, mmrDiff: number, userScore: number) {
    this.userId = userId;
    this.mmrDiff = mmrDiff;
    this.userScore = userScore;
    this.isFriend = false;
  }

  private user: Socket;
  private userId: string;
  private nickname: string;
  private mmrDiff: number;
  private userScore: number;
  private isFriend: boolean;

  public getUserId() {
    return this.userId;
  }

  public getSocket() {
    return this.user;
  }

  public setIsFriend(isFriend: boolean) {
    this.isFriend = isFriend;
  }

  public setNickname(nickname: string) {
    this.nickname = nickname;
  }

  public setUserSocket(user: Socket) {
    this.user = user;
  }

  public getMmrDiff() {
    return this.mmrDiff;
  }
}
