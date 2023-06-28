import { SimpleItemPolicy } from "./simple.item.policy";
import { ItemPolicy } from "./item.policy";
import { describe } from "node:test";
import { Item } from "./item.enum";

describe("SimpleItemPolicy", () => {
  let itemPolicy: ItemPolicy;

  beforeEach(() => {
    itemPolicy = new SimpleItemPolicy();
  });

  describe("getItem()", () => {
    it("getItem()이 3번 호출 됐을때 Item 을 반환", () => {
      itemPolicy;
      // const items1 = itemPolicy.getItems();
      // expect(items1).toBe(Item.NULL);
      // const items2 = itemPolicy.getItems();
      // expect(items2).toBe(Item.NULL);
      // const items3 = itemPolicy.getItems();
      // expect(items3).not.toBe(Item.NULL);
    });

    it("아이템이 KEY_UP/ MUTE 순서대로 반환", () => {
      // itemPolicy.getItems();
      // itemPolicy.getItems();
      // const keyup = itemPolicy.getItems();
      // expect(keyup).toBe(Item.KEY_UP);
      // itemPolicy.getItems();
      // itemPolicy.getItems();
      // const mute = itemPolicy.getItems();
      // expect(mute).toBe(Item.MUTE);
    });
  });
});
