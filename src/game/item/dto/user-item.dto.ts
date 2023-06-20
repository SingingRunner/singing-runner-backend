import { Item } from "../item.enum";

export class UserItemDto {
  private userId: string;
  private item: Item;

  public getUserId(): string {
    return this.userId;
  }

  public getItem(): Item {
    return this.item;
  }
}
