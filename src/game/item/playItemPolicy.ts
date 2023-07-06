import { Injectable } from "@nestjs/common";
import { ItemPolicy } from "./item.policy";
import { Item } from "./item.enum";

@Injectable()
export class PlayItemPolicy implements ItemPolicy {
  private userItemMap: Map<string, Item[]> = new Map();
  private userCountMap: Map<string, number> = new Map();
  constructor() {
    //조먹이
    this.userItemMap.set("f89509e7-9714-415b-90f7-54f873889944", [
      Item.CLOUD,
      Item.FROZEN,
      Item.MUTE,
      Item.FROZEN,
    ]);
    //우주꼬맹단
    this.userItemMap.set("ddb6c601-e624-4d4a-853b-0e3200c19a80", [
      Item.CLOUD,
      Item.FROZEN,
      Item.MUTE,
      Item.FROZEN,
    ]);
    //섭지코지
    this.userItemMap.set("bcd11577-71ec-4b7e-b291-f37a3dc3aa70", [
      Item.KEY_UP,
      Item.SUPER,
      Item.KEY_UP,
      Item.SUPER,
    ]);
    //오민규리
    this.userItemMap.set("d509d351-e801-4733-bc86-5c4de5019035", [
      Item.CLOUD,
      Item.FROZEN,
      Item.MUTE,
      Item.FROZEN,
    ]);
    //달려라하니
    this.userItemMap.set("8fd953f9-5b34-4c30-96b5-49ca6d5bec22", [
      Item.CLOUD,
      Item.FROZEN,
      Item.MUTE,
      Item.FROZEN,
    ]);
    //밍뭉
    this.userItemMap.set("4de3b7ec-7eef-41eb-b407-b9b4de78fc6a", [
      Item.CLOUD,
      Item.FROZEN,
      Item.MUTE,
      Item.FROZEN,
    ]);
    this.userCountMap.set("f89509e7-9714-415b-90f7-54f873889944", 0);
    this.userCountMap.set("bcd11577-71ec-4b7e-b291-f37a3dc3aa70", 0);
    this.userCountMap.set("ddb6c601-e624-4d4a-853b-0e3200c19a80", 0);
    this.userCountMap.set("d509d351-e801-4733-bc86-5c4de5019035", 0);
    this.userCountMap.set("8fd953f9-5b34-4c30-96b5-49ca6d5bec22", 0);
    this.userCountMap.set("4de3b7ec-7eef-41eb-b407-b9b4de78fc6a", 0);
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
    this.userCountMap.set(userId, ++count);
    if (count === 4) {
      this.userCountMap.set(userId, 0);
    }
    return item;
  }
  useItemAll(item: Item): boolean {
    console.log(item);
    for (const key of this.userCountMap.keys()) {
      this.userCountMap.set(key, 0);
    }
    return true;
  }
  escapeItem(item: Item): boolean {
    console.log(item);
    return true;
  }
}
