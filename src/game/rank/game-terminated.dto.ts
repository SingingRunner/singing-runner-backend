export class GameTerminatedDto {
  public userId: string;
  public mmrDiff: number;
  public userScore: number;

  constructor(userId: string, mmrDiff: number, userScore: number) {
    this.userId = userId;
    this.mmrDiff = mmrDiff;
    this.userScore = userScore;
  }
}
