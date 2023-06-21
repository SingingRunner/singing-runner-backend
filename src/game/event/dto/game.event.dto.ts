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

  public getTimestamp() {
    return this.timestamp;
  }

  public getUserId() {
    return this.userId;
  }

  public getEventName() {
    return this.eventName;
  }

  public getEventContent() {
    return this.eventContent;
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
