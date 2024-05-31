import {AbstractSingleton} from "../core/AbstractSingleton";
import {Logger} from "../logger/Logger";

export class HeartbeatManager extends AbstractSingleton {

    // 间隔
    private _taskNameToHbTaskMap = new Map<string, any>();

    // 开始心跳
    startHeartbeat(taskName: string, intervalMs: number, callback: Function) {
        if (!callback) {
            Logger.DEFAULT.warn(`callback is null. taskName = ${taskName}`)
            return;
        }

        if (this._taskNameToHbTaskMap.has(taskName)) {
            Logger.DEFAULT.warn(`taskName already exists. taskName = ${taskName}`)
            return;
        }

        this._taskNameToHbTaskMap[taskName] = setInterval(() => {
            Logger.DEFAULT.debug(`taskName already exists. taskName = ${taskName}`)
            callback();
        }, intervalMs);
    }

    // 取消心跳
    cancelHeartbeat(taskName: string) {
        clearInterval(this._taskNameToHbTaskMap[taskName]);
        delete this._taskNameToHbTaskMap[taskName];
    }
}
