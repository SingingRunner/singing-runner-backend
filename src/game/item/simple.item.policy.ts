import { Injectable } from '@nestjs/common';
import { Item } from './item.enum';
import { ItemPolicy } from './item.policy';

@Injectable()
export class SimpleItemPolicy implements ItemPolicy {
  items: Item[] = [Item.KEY_UP, Item.MUTE, Item.FROZEN, Item.KEY_DOWN];
  private itemCount = 0;
  private itemIndex = 0;

  getItems(): Item {
    this.itemCount++;
    if (this.itemCount < 3) {
      return null;
    }
    if (this.itemIndex >= this.items.length) {
      this.itemIndex = 0;
    }
    this.itemCount = 0;
    return this.items[this.itemIndex++];
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
