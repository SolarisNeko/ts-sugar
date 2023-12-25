import { FSM, State as AbstractState } from "../../src/fsm/FSM";

describe('FSM', () => {
    let fsm;
  
    beforeEach(() => {
      fsm = new FSM();
    });
  
    test('should add and switch states correctly', () => {
      const state1 = new MockState(fsm, 'state1');
      const state2 = new MockState(fsm, 'state2');
  
      fsm.addState('state1', state1);
      fsm.addState('state2', state2);
  
      fsm.firstStateId('state1');
  
      expect(fsm.tick('testData')).toBe(true);
      expect(fsm.tick('testData')).toBe(false);
  
      fsm.setState('state2');
  
      expect(fsm.tick('testData')).toBe(true);
      expect(fsm.tick('testData')).toBe(false);
    });
  });
  
  class MockState extends AbstractState<String> {
    constructor(fsm, stateId) {
      super(fsm, stateId);
    }
  
    tryUpdateState(data) {
      return 'state2'; // Mock implementation, you can modify it based on your logic
    }
  
    onEnter(data) {
      // Mock implementation
    }
  
    onTick(data) {
      // Mock implementation
    }
  
    onExit(data) {
      // Mock implementation
    }
  }
  