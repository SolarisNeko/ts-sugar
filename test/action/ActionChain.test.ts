import ActionChain, { Action } from "../../src/action/ActionChain";
// Mock the setTimeout function
jest.mock('timers', () => ({
  ...jest.requireActual('timers'),
  setTimeout: (cb: () => void) => cb(),
}));

describe('ActionChain', () => {
  test('should execute actions in sequence', (done) => {
    const mockAction1: Action = jest.fn((ok) => {
      setTimeout(() => {
        console.log('Action 1');
        ok();
      }, 100);
    });

    const mockAction2: Action = jest.fn((ok) => {
      setTimeout(() => {
        console.log('Action 2');
        ok();
      }, 50);
    });

    const mockAction3: Action = jest.fn((ok) => {
      console.log('Action 3');
      ok();
    });

    // Mock console.log
    const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });

    // Execute actions in sequence
    ActionChain.serialize(mockAction1, mockAction2, mockAction3);

    // Ensure actions are executed in the correct order
    setTimeout(() => {
      expect(mockConsoleLog).toHaveBeenNthCalledWith(1, 'Action 1');
      expect(mockConsoleLog).toHaveBeenNthCalledWith(2, 'Action 2');
      expect(mockConsoleLog).toHaveBeenNthCalledWith(3, 'Action 3');
      done();
    }, 200);
  });
});