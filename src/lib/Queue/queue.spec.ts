import { Queue } from "./queue";
describe("Queue ", () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue();
  });

  it("FIFO 테스트 Enqueue 한 값 순서대로 Dequeue", () => {
    queue.enqueue(0);
    queue.enqueue(1);
    queue.enqueue(2);

    expect(queue.size()).toBe(3);
    expect(queue.dequeue()).toBe(0);
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
  });

  it("Empty() size 가 0이 아닐떄 false 반환", () => {
    queue.enqueue(0);
    expect(queue.size()).toBe(1);

    expect(queue.isEmpty()).toBe(false);
  });

  it("remove() 및 iterable", () => {
    queue.enqueue(0);
    queue.enqueue(1);
    queue.enqueue(2);

    queue.remove(1);
    expect(queue.dequeue()).toBe(0);
    expect(queue.dequeue()).toBe(2);
  });
});
