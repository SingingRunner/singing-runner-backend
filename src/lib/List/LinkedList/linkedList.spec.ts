import { LinkedList } from "./linkedlist";

describe("LinkedList", () => {
  let linkedList: LinkedList<number>;
  let linkedListString: LinkedList<string>;
  beforeEach(() => {
    linkedList = new LinkedList();
    linkedListString = new LinkedList();
  });
  describe("prepend Test", () => {
    test("prepend: LinkedList haed 에 추가", () => {
      linkedList.prepend(1);
      linkedList.prepend(2);
      linkedList.prepend(3);

      expect(linkedList.size()).toBe(3);
      expect(linkedList.find(0)).toBe(3);
      expect(linkedList.find(1)).toBe(2);
      expect(linkedList.find(2)).toBe(1);
    });
  });

  describe("append Test", () => {
    test("append: LinkedList tail 에 추가", () => {
      linkedList.append(1);
      linkedList.append(2);
      linkedList.append(3);

      expect(linkedList.size()).toBe(3);
      expect(linkedList.find(0)).toBe(1);
      expect(linkedList.find(1)).toBe(2);
      expect(linkedList.find(2)).toBe(3);
    });
  });

  describe("find Test", () => {
    test("find: 범위에 벗어난 index 접근시 Index Out Of Bound Error 발생", () => {
      linkedList.append(0);
      linkedList.prepend(1);

      expect(linkedList.size()).toBe(2);
      expect(() => linkedList.find(2)).toThrow("Index Out of Bound");
      expect(() => linkedList.find(3)).toThrow("Index Out of Bound");
    });
  });

  describe("indexOf Test", () => {
    test("indexOf: List 에서 value 랑 일치하는 index 반환", () => {
      linkedListString.append("Node0");
      linkedListString.append("Node1");
      linkedListString.append("Node2");

      expect(linkedListString.size()).toBe(3);
      expect(linkedListString.indexOf("Node0")).toBe(0);
      expect(linkedListString.indexOf("Node1")).toBe(1);
      expect(linkedListString.indexOf("Node2")).toBe(2);
    });
    test("indexOf: List 에 없는 value 일 경우 Index of your value not found Error 발생", () => {
      linkedListString.append("Node0");
      linkedListString.append("Node1");
      linkedListString.append("Node2");

      expect(linkedListString.size()).toBe(3);
      expect(() => linkedListString.indexOf("Node3")).toThrow(
        "Index of your value not found"
      );
    });
  });

  describe("pop Test", () => {
    test("pop: List 뒤에서부터 삭제", () => {
      linkedList.append(0);
      linkedList.append(1);
      linkedList.append(2);
      linkedList.prepend(3);

      linkedList.pop();

      expect(linkedList.size()).toBe(3);
      expect(linkedList.find(0)).toBe(3);
      expect(linkedList.find(1)).toBe(0);
    });
    test("pop: node가 하나있을때 linkedList head tail이 null값으로 초기화 될 것", () => {
      linkedList.append(0);

      linkedList.pop();

      expect(linkedList.size()).toBe(0);
      expect(() => linkedList.find(0)).toThrow("Index Out of Bound");
    });
  });

  describe("unshift Test", () => {
    test("unshift: List 앞에서부터 삭제", () => {
      linkedList.append(0);
      linkedList.append(1);
      linkedList.append(2);
      linkedList.prepend(3);

      linkedList.unshift();

      expect(linkedList.size()).toBe(3);
      expect(linkedList.find(0)).toBe(0);
      expect(linkedList.find(1)).toBe(1);
    });
    test("unshift: node가 하나있을때 linkedList head tail이 null값으로 초기화 될 것", () => {
      linkedList.append(0);

      linkedList.unshift();

      expect(linkedList.size()).toBe(0);
      expect(() => linkedList.find(0)).toThrow("Index Out of Bound");
    });
  });

  describe("delete Test", () => {
    test("delete: 특정 value를 갖는 node 삭제", () => {
      linkedList.append(0);
      linkedList.append(1);
      linkedList.append(2);
      linkedList.append(3);

      linkedList.delete(1);
      linkedList.delete(2);

      expect(linkedList.size()).toBe(2);
      expect(linkedList.find(0)).toBe(0);
      expect(linkedList.find(1)).toBe(3);
    });

    test("delete: List에 존재하지 않는 value를 삭제 시도시 Error 발생", () => {
      linkedList.append(0);

      expect(() => linkedList.delete(2)).toThrow("Can not delete your value");
    });
  });

  describe("isEmpty Test", () => {
    test("isEmpty: LinkedList 에 Node 가 존재하지 않을때 true 반환", () => {
      linkedList.append(0);
      linkedList.pop();

      expect(linkedList.size()).toBe(0);
      expect(linkedList.isEmpty()).toBe(true);
    });

    test("isEmpty: LinkedList 에 Node 가 존재하면 false 반환", () => {
      linkedList.append(1);

      expect(linkedList.size()).toBe(1);
      expect(linkedList.isEmpty()).toBe(false);
    });
  });

  /**
   * 테스트 코드 먼저 작성해보기
   */
  describe("Insert Test", () => {
    test("insert: 특정 index 에 value 추가", () => {
      linkedList.append(0);
      linkedList.append(1);
      linkedList.append(2);
      linkedList.insert(100, 1);

      expect(linkedList.size()).toBe(4);
      expect(linkedList.find(0)).toBe(0);
      expect(linkedList.find(1)).toBe(100);
      expect(linkedList.find(2)).toBe(1);
      expect(linkedList.find(3)).toBe(2);
    });

    test("insert: 맨앞(haed)에 insert 하기", () => {
      linkedList.append(0);
      linkedList.append(1);
      linkedList.append(2);
      linkedList.insert(100, 0);

      expect(linkedList.size()).toBe(4);
      expect(linkedList.find(0)).toBe(100);
      expect(linkedList.find(1)).toBe(0);
      expect(linkedList.find(2)).toBe(1);
      expect(linkedList.find(3)).toBe(2);
    });

    test("insert: 맨뒤(tail)에 insert 하기", () => {
      linkedList.append(0);
      linkedList.append(1);
      linkedList.append(2);
      linkedList.insert(100, 3);

      expect(linkedList.size()).toBe(4);
      expect(linkedList.find(0)).toBe(0);
      expect(linkedList.find(1)).toBe(1);
      expect(linkedList.find(2)).toBe(2);
      expect(linkedList.find(3)).toBe(100);
    });

    test("insert: 범위를 넘어선 index에 insert 시 Index Out of Bound Error 발생", () => {
      linkedList.append(0);
      linkedList.append(1);
      linkedList.append(2);

      expect(() => linkedList.insert(100, 100)).toThrow("Index Out of Bound");
    });
  });
});
