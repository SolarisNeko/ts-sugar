// Mock PlayerLike for testing purposes
import {PlayerLike, TestPlayer} from "../../src/player/PlayerLike";
import {MyTaskManager} from "../../src/task/MyTaskManager";
import {
    PlayerTask,
    TaskConfig,
    TaskEventHandler,
    TaskTarget,
    TaskTargetConfig,
    TaskTargetTypeHandler,
    TaskTargetTypeRegister,
} from "../../src/task/Task";
import console from "console";
import {Clazz} from "../../src/types/Types";
import {ObjectUtils} from "../../src/utils/ObjectUtils";

let testPlayer: PlayerLike = new TestPlayer();

describe('MyTaskManager', () => {
    let taskManager: MyTaskManager;
    let result = 0

    class MockTaskTargetTypeHandler extends TaskTargetTypeHandler {
        protected initEventTypeHandler(): void {
            this.putEventHandler(String, new class implements TaskEventHandler<String> {
                handle(player: PlayerLike, target: TaskTarget, eventName: string, event: String): void {
                    console.log('类型匹配调用成功!')
                    target.setProgressValue(10)
                    result = 1
                }
            })
        }

        getInterestEventClass(): Clazz<any>[] {
            return [String];
        }

    }


    beforeEach(() => {
        taskManager = new MyTaskManager();
        result = 0
        TaskTargetTypeRegister.registerHandler("demo", new MockTaskTargetTypeHandler())
    });

    test('InitTasks should initialize tasks correctly', () => {
        const taskConfigs: TaskConfig[] = [
            // Add some task configurations here for testing
            // Example: { taskId: 1, taskName: 'Task 1', taskType: 'default', ... }
        ];

        taskManager.initTasks(taskConfigs, () => {
        });

        // Check if tasks are initialized correctly
        expect(taskManager.getAllTasks().size).toBe(taskConfigs.length);

        // Check if tasks are added to the taskMap
        taskConfigs.forEach((taskConfig) => {
            const task = taskManager.getTask(taskConfig.taskId);
            expect(task).toBeDefined();
            expect(task?.taskConfig).toEqual(taskConfig);
        });
    });

    test('ReceiveEvent should trigger tasks correctly', () => {
        const taskConfig: TaskConfig = {
            taskGroupId: 1,
            taskId: 1,
            taskName: 'Test Task',
            taskType: 'default',
            taskTargetList: [
                ObjectUtils.initObj(new TaskTargetConfig(), (obj => {
                    obj.taskTargetType = 'demo'
                    obj.maxProgressValue = 100
                })),
            ],
        };

        const playerTask = new PlayerTask(taskConfig, () => {
        });
        taskManager.initTasks([taskConfig], () => {
        });

        // Mock event data
        const eventData = 'someEventData';

        // Receive the event
        taskManager.onEvent(testPlayer, 'someEventName', String, eventData);

        // Check if the task's onEvent method is called
        expect(result).toBe(1);

    });
});
