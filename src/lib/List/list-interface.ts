export interface List<T> {
  prepend(value: T): void;
  append(value: T): void;
  delete(value: T): void;
  pop(): void;
  unshift(): void;
  insert(value: T, index: number): void;
  indexOf(value: T): number | null;
  find(index: number): T | null;
  isEmpty(): boolean;
  size(): number;
}
