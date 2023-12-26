import { FSM, AbstractState, StateChangeResult } from "../../src/fsm/FSM";

// Mock data for testing
const testData = { /* your test data here */ };

// Mock State implementation for testing
class StateA extends AbstractState<typeof testData> {
    getCanTransitionStateId(): string[] {
        return ['b'];
    }

    isCanEnterThisState(data: typeof testData): boolean {
        // your implementation, for example:
        return true;
    }

    onEnter(data: typeof testData): void {
        // your implementation
    }

    onTick(data: typeof testData): void {
        // your implementation
    }

    onExit(data: typeof testData): void {
        // your implementation
    }
}

class StateB extends AbstractState<typeof testData> {
    getCanTransitionStateId(): string[] {
        return ['a'];
    }

    isCanEnterThisState(data: typeof testData): boolean {
        // your implementation, for example:
        return true;
    }

    onEnter(data: typeof testData): void {
        // your implementation
    }

    onTick(data: typeof testData): void {
        // your implementation
    }

    onExit(data: typeof testData): void {
        // your implementation
    }
}

describe('FSM', () => {
    let fsm: FSM<typeof testData>;

    beforeEach(() => {
        fsm = new FSM();
        fsm.addState('a', new StateA(fsm, 'a'));
        fsm.addState('b', new StateB(fsm, 'b'));
    });

    test('tick should automatically transition between states', () => {
        fsm.enterStateId('a');
        fsm.exitStateId('b');

        const result1: StateChangeResult = fsm.tick(testData);
        expect(result1.stateIdSequence).toEqual(['b']);
        expect(result1.exitStateId).toBe('b');
        expect(result1.stateIdCounterMap.get('b')).toBe(1);

        const result2: StateChangeResult = fsm.tick(testData);
        expect(result2.stateIdSequence).toEqual(['a']);
        expect(result2.exitStateId).toBe('a');
        expect(result2.stateIdCounterMap.get('a')).toBe(1);
    });
});
