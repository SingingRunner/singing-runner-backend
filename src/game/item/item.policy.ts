import { Item } from './item.enum';

export interface ItemPolicy {
  getItems(): Item;
  useItemAll(item: Item): boolean;
  escapeItem(item: Item): boolean;
}
