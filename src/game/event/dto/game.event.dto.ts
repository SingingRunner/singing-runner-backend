/**
 * event dto
 * -timestapm
 * -userId
 * -event:string (socket messsage)
 * -toJson
 */
export class GameEventDto {
  private timestamp: number;
  private userId: string;
  private eventName: string;
  private eventContent: string;

  constructor(timestamp, userId, eventName, eventContent) {
    this.timestamp = timestamp;
    this.userId = userId;
    this.eventName = eventName;
    this.eventContent = eventContent;
  }
  toJSON() {
    return {
      timestamp: this.timestamp,
      userId: this.userId,
      eventName: this.eventName,
      eventContent: this.eventContent,
    };
  }
}
