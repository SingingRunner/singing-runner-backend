export class UserScoreDto {
  public userId: string;
  public score: number;

  constructor(userId: string, score: number) {
    this.userId = userId;
    this.score = score;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getScore(): number {
    return this.score;
  }
}
