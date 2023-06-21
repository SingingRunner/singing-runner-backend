import { SimpleItemPolicy } from "./simple.item.policy";
import { ItemPolicy } from "./item.policy";
import { describe } from "node:test";

describe("SimpleItemPolicy", () => {
  let itemPolicy: ItemPolicy;

  beforeEach(() => {
    itemPolicy = new SimpleItemPolicy();
  });

  describe("getItem()", () => {
    it("getItem()이 3번 호출 됐을때 Item 을 반환", () => {
      const items1 = itemPolicy.getItems();
      expect(items1).not.toHaveLength(0);
      const items2 = itemPolicy.getItems();
      expect(items2).not.toHaveLength(0);
      const items3 = itemPolicy.getItems();
      expect(items3).not.toHaveLength(0);
    });
  });
});
