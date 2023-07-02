import { Item } from "./item.enum";
import { ItemPolicy } from "./item.policy";

export class RandomItemPolicy implements ItemPolicy {
  private items: Item[] = [
    Item.KEY_UP,
    Item.MUTE,
    Item.FROZEN,
    Item.KEY_DOWN,
    Item.CLOUD,
    Item.SUPER,
  ];

  public getItems(userId: string): Item {
    userId;
    const randomIndex = Math.floor(Math.random() * this.items.length);
    return this.items[randomIndex];
  }

  useItemAll(item: Item): boolean {
    if (item === Item.KEY_UP || item === Item.KEY_DOWN) {
      return true;
    }
    return false;
  }

  escapeItem(item: Item): boolean {
    if (item === Item.FROZEN || item === Item.MUTE) {
      return true;
    }
    return false;
  }
}
