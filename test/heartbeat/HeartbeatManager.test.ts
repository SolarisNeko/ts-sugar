import {HeartbeatManager} from "../../src/heartbeat/HeartbeatManager";

// Mock setInterval and clearInterval
jest.useFakeTimers();

describe('HeartbeatManager', () => {
    let heartbeatManager;

    beforeEach(() => {
        heartbeatManager = new HeartbeatManager();
    });

    afterEach(() => {
        // Reset timers after each test
        jest.clearAllTimers();
    });

    test('startHeartbeat should set up an interval', () => {
        const taskName = 'testTask';
        const intervalMs = 1000;
        const callback = jest.fn();

        heartbeatManager.startHeartbeat(taskName, intervalMs, callback);

        // Advance timers by the intervalMs
        jest.advanceTimersByTime(intervalMs);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    test('cancelHeartbeat should clear the interval', () => {
        const taskName = 'testTask';
        const intervalMs = 1000;
        const callback = jest.fn();

        heartbeatManager.startHeartbeat(taskName, intervalMs, callback);
        heartbeatManager.cancelHeartbeat(taskName);

        // Advance timers by the intervalMs
        jest.advanceTimersByTime(intervalMs);

        expect(callback).toHaveBeenCalledTimes(0);
    });

    test('cancelHeartbeat should handle non-existing interval', () => {
        const taskName = 'nonExistingTask';

        // Ensure no error occurs when canceling non-existing interval
        expect(() => heartbeatManager.cancelHeartbeat(taskName)).not.toThrow();
    });
});