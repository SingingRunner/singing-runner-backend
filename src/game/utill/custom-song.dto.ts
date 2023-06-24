export class CustomSongDto {
  private songId: number;
  private sontTilte: string;
  private singer: string;

  constructor($songId: number, $sontTilte: string, $singer: string) {
    this.songId = $songId;
    this.sontTilte = $sontTilte;
    this.singer = $singer;
  }
}
