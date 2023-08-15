import { List } from "../list-interface";
import { Node } from "../../Node/node";
export class LinkedList<T> implements List<T> {
  private head: Node<T> | null;
  private tail: Node<T> | null;
  private count: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  public prepend(value: T): void {
    const newNode = new Node(value);
    this.count++;
    if (this.isInitialNode(newNode)) {
      return;
    }

    newNode.next = this.head;
    this.head!.prev = newNode;

    this.head = newNode;
  }
  public append(value: T): void {
    const newNode = new Node(value);
    this.count++;
    if (this.isInitialNode(newNode)) {
      return;
    }

    newNode.prev = this.tail;
    this.tail!.next = newNode;

    this.tail = newNode;
  }
  public find(index: number): T | null {
    let node = this.head;
    let currentIndex = 0;
    if (index > this.size() - 1) {
      throw new Error("Index Out of Bound");
    }
    while (node !== null) {
      if (index === currentIndex) {
        return node.getValue();
      }
      currentIndex += 1;
      node = node.next;
    }
    throw new Error("Index Out of Bound");
  }

  public indexOf(value: T): number | null {
    let node = this.head;
    let currentIndex = 0;
    while (node !== null) {
      if (value === node.getValue()) {
        return currentIndex;
      }
      currentIndex += 1;
      node = node.next;
    }
    throw new Error("Index of your value not found");
  }

  public delete(value: T): void {
    let node = this.head;
    while (node !== null) {
      if (value === node.getValue()) {
        this.nodeToDelete(node);
        this.count -= 1;
        return;
      }
      node = node.next;
    }
    throw new Error("Can not delete your value");
  }

  private nodeToDelete(node: Node<T>): void {
    if (node.prev === null) {
      this.unshift();
      return;
    }
    if (node.next === null) {
      this.pop();
      return;
    }
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  public pop(): void {
    if (this.tail === null) {
      return;
    }
    this.count -= 1;
    if (this.tail === this.head) {
      this.head = null;
      this.tail = null;
      return;
    }

    this.tail.prev!.next = null;
    this.tail = this.tail?.prev;
  }
  public unshift(): void {
    if (this.head === null) {
      return;
    }
    this.count -= 1;
    if (this.tail === this.head) {
      this.head = null;
      this.tail = null;
      return;
    }

    this.head.next!.prev = null;
    this.head = this.head?.next;
  }

  insert(value: T, index: number): void {
    if (index > this.size()) {
      throw new Error("Index Out of Bound");
    }
    if (index === 0) {
      this.prepend(value);
      return;
    }
    if (index === this.size()) {
      this.append(value);
      return;
    }

    let node = this.head;
    let currentIndex = 0;
    const newNode: Node<T> = new Node(value);

    while (node !== null) {
      if (index === currentIndex) {
        node.prev!.next = newNode;
        newNode.prev = node.prev;

        node.prev = newNode;
        newNode.next = node;

        this.count++;
        return;
      }
      currentIndex += 1;
      node = node.next;
    }
    throw new Error("Index Out of Bound");
  }

  isEmpty(): boolean {
    if (this.size() === 0) {
      return true;
    }
    return false;
  }

  public size(): number {
    return this.count;
  }

  private isInitialNode(newNode: Node<T>): boolean {
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      return true;
    }
    return false;
  }
}
