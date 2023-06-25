export class CustomSongDto {
  private songId: number;
  private songTitle: string;
  private singer: string;

  constructor($songId: number, $sontTilte: string, $singer: string) {
    this.songId = $songId;
    this.songTitle = $sontTilte;
    this.singer = $singer;
  }
}
