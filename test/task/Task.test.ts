import {
    PlayerTask,
    TaskConfig,
    TaskEventHandler,
    TaskPhaseEnum,
    TaskTarget,
    TaskTargetTypeHandler,
    TaskTargetTypeRegister,
} from "../../src/task/Task";
import {PlayerLike, TestPlayer} from "../../src/player/PlayerLike"; // Update the path accordingly

// Mocking a simple player-like object for testing
const mockPlayer: PlayerLike = new TestPlayer()

// Mocking a simple handler for testing
class MockTaskTargetTypeHandler extends TaskTargetTypeHandler {
    protected initEventTypeHandler(): void {
        this.putEventHandler(DemoTaskEvent, new class implements TaskEventHandler<DemoTaskEvent> {
            handle(player: PlayerLike, target: TaskTarget, eventName: string, event: DemoTaskEvent): void {
                console.log('类型匹配调用成功!')
                target.setProgressValue(10)
            }
        })
    }


}

class DemoTaskEvent {
    data: string
}

// Mocking a simple condition checker for testing
const mockConditionChecker = {
    verify: jest.fn().mockReturnValueOnce({isSuccess: () => true}),
};

describe('PlayerTask', () => {
    let playerTask: PlayerTask;

    beforeEach(() => {
        const taskConfig: TaskConfig = {
            taskGroupId: 1,
            taskId: 1,
            taskName: 'Test Task',
            taskType: 'default',
            taskTargetList: [
                {taskTargetType: 'exampleType', targetProgressValue: 10},
            ],
        };

        playerTask = new PlayerTask(taskConfig, (task: PlayerTask) => {
        });
    });

    test('PlayerTask initialization', () => {
        expect(playerTask.phase).toBe(0); // Check initial phase
        expect(playerTask.getTaskTargets()).toHaveLength(1); // Check if task targets are initialized
    });

    test('Accepting the task', () => {
        playerTask.acceptTask();
        expect(playerTask.phase).toBe(1); // Check if the task is in the correct phase after acceptance
    });

    // Add more tests for other methods as needed

    test('Receiving events', () => {
        const mockHandler = new MockTaskTargetTypeHandler();

        // Spy on the handleEvent method
        const handleEventSpy = jest.spyOn(mockHandler, 'handleEvent');

        // Register the handler
        TaskTargetTypeRegister.registerHandler('exampleType', mockHandler);

        let event = new DemoTaskEvent();
        event.data = 'demo'

        // Call the method that triggers handleEvent
        playerTask.receiveEvent(mockPlayer, 'exampleEvent', event);

        // Add assertions based on your mock handler's logic
        expect(handleEventSpy).toHaveBeenCalled();

        expect(playerTask.phase == TaskPhaseEnum.finish)
    });

});
