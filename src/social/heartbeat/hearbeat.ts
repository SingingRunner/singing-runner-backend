export interface HeartBeat {
  updateHeartBeatMap(userId: string, updateAt: Date): void;
  deleteHeartBeatMap(userId: string): void;
  updateDB(userId: string): void;
}
