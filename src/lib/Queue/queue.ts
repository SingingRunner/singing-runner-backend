import { LinkedList } from "../List/LinkedList/linkedlist";

export class Queue<T> {
  private list: LinkedList<T>;

  constructor() {
    this.list = new LinkedList<T>();
  }

  enqueue(value: T): void {
    this.list.append(value);
  }

  dequeue(): T | null {
    if (this.list.isEmpty()) {
      return null;
    }
    const dequeuedValue = this.list.find(0);
    this.list.unshift();
    return dequeuedValue;
  }

  peek(): T | null {
    return this.list.find(0);
  }

  prepend(value: T): void {
    this.list.prepend(value);
  }

  isEmpty(): boolean {
    return this.list.isEmpty();
  }

  size(): number {
    return this.list.size();
  }

  remove(value: T) {
    this.list.delete(value);
  }

  *[Symbol.iterator](): Iterator<T> {
    let currentNode = this.list["head"];
    while (currentNode) {
      yield currentNode.getValue();
      currentNode = currentNode.next;
    }
  }
}
