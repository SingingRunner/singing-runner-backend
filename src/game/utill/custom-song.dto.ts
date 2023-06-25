export class CustomSongDto {
  private songId: number;
  private songTitle: string;
  private singer: string;

  constructor($songId: number, $sontTitle: string, $singer: string) {
    this.songId = $songId;
    this.songTitle = $sontTitle;
    this.singer = $singer;
  }
}
