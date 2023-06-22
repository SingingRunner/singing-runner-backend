export class UserResultDto {
  private userId: string;
  private score: number;
  private userVocal: Blob[];

  constructor($userId: string, $score: number) {
    this.userId = $userId;
    this.score = $score;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getScore(): number {
    return this.score;
  }

  public getUserVocal(): Blob[] {
    return this.userVocal;
  }
}
