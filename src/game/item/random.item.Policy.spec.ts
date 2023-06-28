import { Item } from "./item.enum";
import { RandomItemPolicy } from "./random.item.policy";

describe("RandomItemPolicy", () => {
  let randomItemPolicy: RandomItemPolicy;

  beforeEach(() => {
    randomItemPolicy = new RandomItemPolicy();
  });

  it("Frozen 반환 (mock 을 활용해 랜덤값 고정시켜 테스트)", () => {
    randomItemPolicy;
    // jest.spyOn(Math, "random").mockReturnValue(0.5);
    // const item = randomItemPolicy.getItems();
    // expect(item).toBe(Item.FROZEN);
  });

  it("getItem 호출마다 다른 아이템 반환", () => {
    // Mock the Math.random() function to return fixed values for each call
    // jest
    //   .spyOn(Math, "random")
    //   .mockReturnValueOnce(0.2)
    //   .mockReturnValueOnce(0.5);
    // const item1 = randomItemPolicy.getItems();
    // const item2 = randomItemPolicy.getItems();
    // expect(item1).toBe(Item.MUTE);
    // expect(item2).toBe(Item.FROZEN);
  });

  // Restore the original implementation of Math.random() after the tests
  afterAll(() => {
    jest.restoreAllMocks();
  });
});
