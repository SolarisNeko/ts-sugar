import {FSM, FSMStateAbstract, FSMStateChangeResult} from "../../src/fsm/FSM";

// Mock data for testing
const testData = { /* your test data here */};

// Mock State implementation for testing
class StateA extends FSMStateAbstract<typeof testData> {
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

class StateB extends FSMStateAbstract<typeof testData> {
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

        const result1: FSMStateChangeResult = fsm.tick(testData);

        expect(result1.stateIdSequence).toEqual(['b']);
        expect(result1.exitStateId).toBe('b');
        expect(result1.tickCount).toBe(1);

        const result2: FSMStateChangeResult = fsm.tick(testData);
        expect(result2.stateIdSequence).toEqual(['a']);
        expect(result2.exitStateId).toBe('a');
        expect(result2.tickCount).toBe(1);
    });
});
