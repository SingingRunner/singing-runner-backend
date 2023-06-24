import { Socket } from "socket.io";

export class GameTerminatedDto {
  constructor(userId: string, mmrDiff: number, userScore: number) {
    this.userId = userId;
    this.mmrDiff = mmrDiff;
    this.userScore = userScore;
    this.isFriend = false;
    this.tier = "BRONZE";
    this.nickname = "오민규리";
  }

  private user: Socket;
  private userId: string;
  private nickname: string;
  private mmrDiff: number;
  private userScore: number;
  private isFriend: boolean;
  private tier: string;

  public getUserId() {
    return this.userId;
  }

  public getSocket() {
    return this.user;
  }

  public setIsFriend(isFriend: boolean) {
    this.isFriend = isFriend;
  }
  public getNickname() {
    return this.nickname;
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
