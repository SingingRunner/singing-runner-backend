export interface HeartBeat {
  setHeartBeatMap(userId: string, logingAt: Date): void;
  deleteHeartBeatMap(userId: string): void;
  updateHeartBeatMap(userId: string, activeAt: Date): void;
  updateDB(userId: string): void;
}
