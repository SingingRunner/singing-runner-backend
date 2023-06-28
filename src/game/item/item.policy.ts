import { Item } from "./item.enum";

export interface ItemPolicy {
  getItems(userId: string): Item;
  useItemAll(item: Item): boolean;
  escapeItem(item: Item): boolean;
}
