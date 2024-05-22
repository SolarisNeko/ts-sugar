import {PlayerLike} from "../player/PlayerLike";
import {Clazz} from "../types/Types";
import {ArrayUtils} from "../utils/ArrayUtils";
import {ProgressBar233} from "../core/ProgressBar233";

import {IUnRegister, UnRegister} from "../unregister/UnRegister";

export enum TaskPhaseEnum {
    noOpen = 0,          // 未开启
    canAccept = 1,       // 可接受
    inProgress = 2,      // 进行中
    finish = 3,          // 完成
    reward = 4           // 领取奖励
}

/**
 * 任务的单个目标的配置
 */
export class TaskTargetConfig {
    // 任务目标类型
    taskTargetType: string;
    // 最大进度
    maxProgressValue: number;
    // 任务目标数据
    data?: any;
}

/**
 * 任务配置
 */
export class TaskConfig {
    // 任务组 ID
    taskGroupId: number;
    // 任务 ID
    taskId: number;
    // 任务名字
    taskName: string;
    // 任务类型
    taskType: string = "default";
    // 任务多个目标
    taskTargetList: TaskTargetConfig[];
    // -------- optional -------------
}

// 任务目标, 带状态
export class TaskTarget {
    // 任务目标类型
    readonly type: string;
    // 任务目标数据
    readonly data?: any;
    // 进度条
    private progressBar: ProgressBar233

    constructor(config: TaskTargetConfig) {
        this.type = config.taskTargetType;
        this.data = config.data;
        this.progressBar = new ProgressBar233(config.maxProgressValue);
    }

    // 更新任务目标状态
    setProgressValue(value: number): void {
        this.progressBar.curProgressValue = value;
    }

    addProgressValue(value: number): void {
        this.progressBar.curProgressValue += value;
    }

    getProgressValue(): number {
        return this.progressBar.curProgressValue
    }

    getProgressPercent(): number {
        return this.progressBar.getProgressPercent()
    }

    getProgressPercentStr(): string {
        return this.progressBar.getProgressPercentStr()
    }

    isComplete(): boolean {
        return this.progressBar.isComplete()
    }

    getProgressBarSingle(): ProgressBar233 {
        return this.progressBar;
    }
}

export interface TaskStateUpdateListener {
    onUpdate(task: PlayerTask,
             oldPhase: TaskPhaseEnum,
             newPhase: TaskPhaseEnum,
    ): void;
}

export interface TaskProgressWatcher {
    onTaskProgressChange(task: PlayerTask): void;
}

/**
 * 任务类
 */
export class PlayerTask {
    // 当前任务阶段
    private oldPhase: TaskPhaseEnum = TaskPhaseEnum.noOpen;
    private currentPhase: TaskPhaseEnum = TaskPhaseEnum.noOpen;
    private taskTargets: TaskTarget[] = [];
    readonly taskConfig: TaskConfig
    // 接取时间
    acceptTimeMs: number = 0;
    private _updateListener: TaskStateUpdateListener
    // 进度监听器
    private progressWatchers: TaskProgressWatcher[] = [];
    private _interestEventClassSet = new Set<Clazz<any>>();


    set updateListener(value: TaskStateUpdateListener) {
        this._updateListener = value;
    }

    /**
     *
     * @param taskConfig 任务配置
     * @param resetTaskStateCallback 重置状态
     */
    constructor(taskConfig: TaskConfig,
                resetTaskStateCallback: (task: PlayerTask) => void,
    ) {
        this.taskConfig = taskConfig
        this.loadConfig();

        // 设置状态
        resetTaskStateCallback(this)

        // 状态同步
        this.oldPhase = this.phase
    }

    /**
     * 初始化任务，恢复历史状态数据
     */
    loadConfig(): void {
        // 根据 TaskConfig 中的 taskTargetList 构建 TaskTarget 实例
        let config: TaskConfig = this.taskConfig;

        // 每一个任务目标
        this.taskTargets = config.taskTargetList
            .map((targetConfig) => {
                return this.createTaskTarget(targetConfig);
            });

        this.taskTargets.forEach((target) => {
            let targetType: string = target.type;
            const targetTypeHandler: TaskTargetTypeHandler = TaskTargetTypeRegister.getHandler(targetType)!;
            if (!targetTypeHandler) {
                return
            }
            let interestEventClass: Clazz<any>[] = targetTypeHandler.getInterestEventClass();
            interestEventClass.forEach((clz) => {
                this._interestEventClassSet.add(clz)
            })
        })
    }

    /**
     * 获取当前任务阶段
     */
    get phase(): TaskPhaseEnum {
        return this.currentPhase;
    }

    setTaskTargetProgressValue(targetIndex: number,
                               progressValue: number,
    ): void {
        if (ArrayUtils.isNotInSafeIndex(this.taskTargets, targetIndex)) {
            console.error(`task target[] 数组访问越界. 安全退出. targetIndex=${targetIndex}, progressValue=${progressValue}`);
            return;
        }
        let taskTarget: TaskTarget = this.taskTargets[targetIndex];
        if (!taskTarget) {
            return
        }
        taskTarget.setProgressValue(progressValue)


        this.tryUpdateTaskState()
        // 通知进度变更
        this.notifyProgressWatchers()
    }

    setTaskTargetProgressValueByMap(progressMap: Map<number, number>): void {
        progressMap.forEach((progressValue, targetIndex) => {
            this.setTaskTargetProgressValue(targetIndex, progressValue);
        });
    }

    /**
     * 完成任务
     */
    finish(player: PlayerLike): boolean {
        if (this.currentPhase !== TaskPhaseEnum.inProgress) {
            return false;
        }
        if (!this.isHaveFinishAllTaskTarget()) {
            return false;
        }
        this.currentPhase = TaskPhaseEnum.finish;
        this.notifyTaskListener()
        return true;
    }

    /**
     * 标记任务可以接收了
     */
    setCanAccept(): boolean {
        if (this.currentPhase !== TaskPhaseEnum.noOpen) {
            return true;
        }

        this.currentPhase = TaskPhaseEnum.canAccept;
        this.notifyTaskListener()
        return true;
    }

    /**
     * 接受任务
     */
    acceptTask(): boolean {
        if (this.currentPhase !== TaskPhaseEnum.canAccept) {
            return false;
        }

        this.currentPhase = TaskPhaseEnum.inProgress;
        this.notifyTaskListener()
        return true;
    }


    /**
     * 检查所有任务目标, 是否已经都完成了 ?
     */
    public isHaveFinishAllTaskTarget(): boolean {
        for (const target of this.taskTargets) {
            // 检查任务目标的进度是否达到目标值
            if (!target.isComplete()) {
                return false;
            }
        }

        return true;
    }

    /**
     * 领取奖励
     */
    receiveReward(): boolean {
        if (this.currentPhase !== TaskPhaseEnum.finish) {
            return false;
        }

        // 处理领取奖励的逻辑
        this.currentPhase = TaskPhaseEnum.reward;
        this.notifyTaskListener()
        return true;
    }

    setFinishState() {
        if (this.currentPhase !== TaskPhaseEnum.reward) {
            return false;
        }

        // 处理领取奖励的逻辑
        this.currentPhase = TaskPhaseEnum.finish;
        this.notifyTaskListener()
        return true;
    }

    /**
     * 获取任务目标状态信息
     */
    getTaskTargets(): TaskTarget[] {
        return this.taskTargets;
    }


    public getInterestEventClassSet(): Set<Clazz<any>> {
        return this._interestEventClassSet;
    }

    /**
     * 【Event】
     * 接收事件，根据事件名称分发给对应的处理器
     * @param playerLike 玩家
     * @param eventName 事件名称
     * @param eventData 事件数据
     */
    onEvent(playerLike: PlayerLike,
            eventName: string,
            eventData: any,
    ): void {
        let clazz: Clazz<any> = eventData.constructor;
        if (!this._interestEventClassSet.has(clazz)) {
            return
        }

        // 处理每个任务目标
        this.taskTargets.forEach(target => {
            const targetTypeHandler: TaskTargetTypeHandler = TaskTargetTypeRegister.getHandler(target.type)!;
            if (!targetTypeHandler) {
                return
            }
            targetTypeHandler.handleEvent(playerLike, target, eventName, eventData);
        });
    }

    /**
     * 根据 TaskTargetConfig 创建 TaskTarget 实例
     */
    private createTaskTarget(targetConfig: TaskTargetConfig): TaskTarget {
        return new TaskTarget(targetConfig);
    }

    private tryUpdateTaskState(): void {
        // 在更新进度后，检查是否已经完成所有任务目标，如果是，则重新计算 currentPhase
        if (this.phase === TaskPhaseEnum.inProgress) {
            if (this.isHaveFinishAllTaskTarget()) {
                this.currentPhase = TaskPhaseEnum.finish;
            }
        }

        this.notifyTaskListener()
    }

    private notifyTaskListener(): void {
        if (this.oldPhase === this.currentPhase) {
            return
        }

        if (!this._updateListener) {
            return;
        }
        this._updateListener.onUpdate(this, this.oldPhase, this.currentPhase);

        // 同步状态
        this.oldPhase = this.currentPhase
    }

    registerProgressValueWatcher(watcher: TaskProgressWatcher): IUnRegister {
        this.progressWatchers.push(watcher);
        return UnRegister.create(() => {
            this.unregisterProgressValueWatcher(watcher)
        })
    }

    unregisterProgressValueWatcher(watcher: TaskProgressWatcher): void {
        const index = this.progressWatchers.indexOf(watcher);
        if (index !== -1) {
            this.progressWatchers.splice(index, 1);
        }
    }

    private notifyProgressWatchers(): void {
        for (const watcher of this.progressWatchers) {
            watcher.onTaskProgressChange(this);
        }
    }

    getAllTargetProgressMap(): Map<number, ProgressBar233> {
        const progressMap = new Map<number, ProgressBar233>();

        this.taskTargets.forEach((target, index) => {
            progressMap.set(index, target.getProgressBarSingle());
        });

        return progressMap;
    }

}

export interface TaskEventHandler<T> {

    handle(player: PlayerLike,
           target: TaskTarget,
           eventName: string,
           event: T,
    ): void
}

// 定义任务目标类型处理器接口
export abstract class TaskTargetTypeHandler {

    protected eventTypeToEventHandlerMap = new Map<Clazz<any>, TaskEventHandler<any>>()

    constructor() {
        this.initEventTypeHandler()
    }

    abstract getInterestEventClass(): Clazz<any>[]

    // 处理事件的方法
    handleEvent(player: PlayerLike,
                target: TaskTarget,
                eventName: string,
                eventData: any,
    ): void {
        let eventClass = eventData.constructor;

        let handler = this.eventTypeToEventHandlerMap.get(eventClass);
        if (!handler) {
            return
        }
        handler.handle(player, target, eventName, eventData)
    }

    putEventHandler<T>(clazz: Clazz<T>,
                       handler: TaskEventHandler<T>,
    ) {
        this.eventTypeToEventHandlerMap.set(clazz, handler)
    }

    protected abstract initEventTypeHandler(): void
}

// 注册表，将任务目标类型与对应的处理器关联
export class TaskTargetTypeRegister {

    // <任务目标类型, 该目标处理器>
    private static targetTypeHandlerMap: Map<string, TaskTargetTypeHandler> = new Map();

    // 注册处理器方法
    static registerHandler(taskTargetType: string, handler: TaskTargetTypeHandler): void {
        this.targetTypeHandlerMap.set(taskTargetType, handler);
    }

    // 获取处理器方法
    static getHandler(type: string): TaskTargetTypeHandler | undefined {
        return this.targetTypeHandlerMap.get(type);
    }
}

