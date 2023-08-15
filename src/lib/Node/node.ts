export class Node<T> {
  public next: Node<T> | null;
  public prev: Node<T> | null;
  private value: T;

  constructor(value: T) {
    this.next = null;
    this.prev = null;
    this.value = value;
  }

  public getValue(): T {
    return this.value;
  }
}
