export class UserScoreDto {
  private userId: string;
  private score: number;

  public getUserId(): string {
    return this.userId;
  }

  public getScore(): number {
    return this.score;
  }

  public toJson() {
    return {
      userId: this.userId,
      score: this.score,
    };
  }
}
