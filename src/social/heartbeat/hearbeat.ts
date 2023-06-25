export interface HeartBeat {
  updateHeartBeatMap(): void;
  setHeartBeatMap(userId: string, updateAt: number): void;
  deleteHeartBeatMap(userId: string): void;
  updateDB(userId: string): void;
}
