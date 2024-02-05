import {
    PlayerTask,
    TaskConfig,
    TaskEventHandler,
    TaskPhaseEnum,
    TaskTarget,
    TaskTargetTypeHandler,
} from "../../src/task/Task";
import {PlayerLike, TestPlayer} from "../../src/player/PlayerLike";
import {Clazz} from "../../src/types/Types";

const mockPlayer: PlayerLike = new TestPlayer()

class MockEvent {
    // Mock implementation for event
}

class MockTaskEventHandler implements TaskEventHandler<MockEvent> {
    handle(player: PlayerLike, target: TaskTarget, eventName: string, event: MockEvent): void {
        // Mock implementation for handling events
    }
}

class MockTaskTargetTypeHandler extends TaskTargetTypeHandler {
    protected initEventTypeHandler(): void {
        // Registering mock event handler
        this.putEventHandler(MockEvent, new MockTaskEventHandler());
    }

    getInterestEventClass(): Clazz[] {
        return [MockEvent];
    }
}

describe('任务阶段测试', () => {
    let playerTask: PlayerTask;

    beforeEach(() => {
        const taskConfig: TaskConfig = {
            taskGroupId: 1,
            taskId: 1,
            taskName: 'Test Task',
            taskType: 'default',
            taskTargetList: [
                {
                    taskTargetType: 'MockTarget',
                    maxProgressValue: 100,
                    data: {},
                },
            ],
        };

        playerTask = new PlayerTask(taskConfig, (task) => {
            // Mock resetTaskStateCallback
        });
    });

    test('initial phase should be noOpen', () => {
        expect(playerTask.phase).toBe(TaskPhaseEnum.noOpen);
    });

    test('setCanAccept should change phase to canAccept', () => {
        playerTask.setCanAccept();
        expect(playerTask.phase).toBe(TaskPhaseEnum.canAccept);
    });

    test('acceptTask should change phase to inProgress', () => {
        playerTask.setCanAccept();
        playerTask.acceptTask();
        expect(playerTask.phase).toBe(TaskPhaseEnum.inProgress);
    });

    test('setTaskTargetProgressValue should update progress value', () => {
        playerTask.setCanAccept();
        playerTask.acceptTask();
        playerTask.setTaskTargetProgressValue(0, 50);

        const taskTarget = playerTask.getTaskTargets()[0];
        expect(taskTarget.getProgressValue()).toBe(50);
    });

    test('finish should change phase to finish if all task targets are complete', () => {
        playerTask.setCanAccept();
        playerTask.acceptTask();
        playerTask.setTaskTargetProgressValue(0, 100);
        playerTask.finish(mockPlayer);

        expect(playerTask.phase).toBe(TaskPhaseEnum.finish);
    });

    test('claimReward should change phase to reward if task is in finish phase', () => {
        playerTask.setCanAccept();
        playerTask.acceptTask();
        playerTask.setTaskTargetProgressValue(0, 100);
        playerTask.finish(mockPlayer);
        playerTask.receiveReward();

        expect(playerTask.phase).toBe(TaskPhaseEnum.reward);
    });
});
