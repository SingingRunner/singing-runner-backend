import { Injectable } from "@nestjs/common";
import { ItemPolicy } from "./item.policy";
import { Item } from "./item.enum";

@Injectable()
export class PlayItemPolicy implements ItemPolicy {
  private userItemMap: Map<string, Item[]> = new Map();
  private userCountMap: Map<string, number> = new Map();
  constructor() {
    this.userItemMap.set("6be57b4a-6747-414b-bf1e-2171c667bbc1", [
      Item.MUTE,
      Item.CLOUD,
      Item.CLOUD,
      Item.MUTE,
      Item.CLOUD,
      Item.FROZEN,
    ]);
    this.userItemMap.set("f5ed40ee-c570-4dad-9a3c-73bc58d475ef", [
      Item.KEY_DOWN,
      Item.FROZEN,
      Item.CLOUD,
      Item.CLOUD,
      Item.FROZEN,
      Item.KEY_UP,
    ]);
    this.userItemMap.set("b9312ffe-07aa-41de-a66a-a14d35738ff1", [
      Item.FROZEN,
      Item.CLOUD,
      Item.KEY_UP,
      Item.KEY_DOWN,
      Item.CLOUD,
      Item.FROZEN,
    ]);
    this.userCountMap.set("6be57b4a-6747-414b-bf1e-2171c667bbc1", 0);
    this.userCountMap.set("f5ed40ee-c570-4dad-9a3c-73bc58d475ef", 0);
    this.userCountMap.set("b9312ffe-07aa-41de-a66a-a14d35738ff1", 0);
  }

  getItems(userId: string): Item {
    let count = this.userCountMap.get(userId);
    if (count === undefined) {
      count = 0;
    }
    const item = this.userItemMap.get(userId)?.[count];
    if (item === undefined) {
      return Item.NULL;
    }
    this.userCountMap.set(userId, count++);
    if (count === 6) {
      this.userCountMap.set(userId, 0);
    }
    return item;
  }
  useItemAll(item: Item): boolean {
    console.log(item);
    return true;
  }
  escapeItem(item: Item): boolean {
    console.log(item);
    return true;
  }
}
