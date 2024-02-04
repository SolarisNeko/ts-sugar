import {PlayerTask, TaskConfig} from "./Task";
import {PlayerLike} from "../player/PlayerLike";
import {Clazz} from "../types/Types";

export class MyTaskManager {
    private taskMap: Map<number, PlayerTask> = new Map();
    private eventTaskIndex: Map<Clazz, PlayerTask[]> = new Map();

    constructor() {
    }

    public initTasks(taskConfigs: TaskConfig[],
                     resetTaskStateCallback: (task: PlayerTask) => void,
    ): void {
        taskConfigs.forEach((taskConfig) => {
            const playerTask = new PlayerTask(taskConfig, resetTaskStateCallback.bind(this));
            let interestEventClassSet: Set<Clazz> = playerTask.getInterestEventClassSet();

            // 将任务添加到 taskMap
            this.taskMap.set(taskConfig.taskId, playerTask);

            // 将任务添加到 eventTaskIndex
            interestEventClassSet.forEach((eventClass) => {
                if (!this.eventTaskIndex.has(eventClass)) {
                    this.eventTaskIndex.set(eventClass, []);
                }
                this.eventTaskIndex.get(eventClass)?.push(playerTask);
            });
        });
    }

    getTask(taskId: number): PlayerTask | undefined {
        return this.taskMap.get(taskId);
    }

    getAllTasks(): Map<number, PlayerTask> {
        return this.taskMap;
    }

    onEvent<T>(playerLike: PlayerLike,
               eventName: string,
               clazz: Clazz<T>,
               eventData: T,
    ): void {
        const interestedTasks = this.eventTaskIndex.get(clazz) || [];
        for (const task of interestedTasks) {
            task.onEvent(playerLike, eventName, eventData);
        }
    }

    // Add other methods as needed for task management
}
