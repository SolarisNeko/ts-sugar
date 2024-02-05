import {
    PlayerTask,
    TaskConfig,
    TaskEventHandler,
    TaskProgressWatcher,
    TaskTarget,
    TaskTargetTypeHandler,
} from "../../src/task/Task";
import {PlayerLike, TestPlayer} from "../../src/player/PlayerLike";
import {ProgressBar} from "../../src/core/ProgressBar";
import {JsonUtils} from "../../src/json/JsonUtils";
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

describe('任务进度测试', () => {
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

        // 创建一个临时实现对象
        const temporaryWatcher: TaskProgressWatcher = {
            onTaskProgressChange: (task: PlayerTask) => {
                // 临时实现的具体逻辑
                let allTargetProgressMap: Map<number, ProgressBar> = task.getAllTargetProgressMap();
                let json: string = JsonUtils.serialize(allTargetProgressMap);
                console.log(`Task progress changed for task ${json}`);
            },
        };
        playerTask.registerProgressValueWatcher(temporaryWatcher)

        playerTask.setTaskTargetProgressValue(0, 100)

    });


});
