export class UserScoreDto {
  private userId: string;
  private nickname: string;
  private score: number;

  constructor($userId: string, $score: number) {
    this.userId = $userId;
    this.score = $score;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getNickname(): string {
    return this.nickname;
  }

  public setNickname(nickname: string) {
    this.nickname = nickname;
  }

  public getScore(): number {
    return this.score;
  }
}
