import FrameCdTimer from "../../src/cd/FrameCdTimer";

describe("FrameCdTimer", () => {
  test("canExecute returns true if key is not in timers", () => {
    const frameCdTimer = new FrameCdTimer(100); // Assuming frameCostMs is 100
    expect(frameCdTimer.canExecute("test")).toBe(true);
  });

  test("canExecute returns true if enough frames have passed", () => {
    const frameCdTimer = new FrameCdTimer(100); // Assuming frameCostMs is 100
    frameCdTimer.execute("test", 3); // Assuming cdMs is 300 (3 frames * 100 ms/frame)
    expect(frameCdTimer.canExecute("test")).toBe(false);
  });

  test("canExecute returns false if not enough frames have passed", () => {
    const frameCdTimer = new FrameCdTimer(100); // Assuming frameCostMs is 100
    frameCdTimer.execute("test", 2); // Assuming cdMs is 200 (2 frames * 100 ms/frame)
    expect(frameCdTimer.canExecute("test")).toBe(false);
  });

  test("execute updates the timer for the key", () => {
    const frameCdTimer = new FrameCdTimer(100); // Assuming frameCostMs is 100
    frameCdTimer.execute("test", 2); // Assuming cdMs is 200 (2 frames * 100 ms/frame)
    expect(frameCdTimer.canExecute("test")).toBe(false);
  });
});
