import {ConditionChecker, ConditionResult} from "../condition/ConditionEngine";
import {PlayerLike} from "../player/PlayerLike";
import {Clazz} from "../types/Types";

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
    // 目标进度
    targetProgressValue: number;
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
    // 接任务条件
    acceptCondition?: ConditionChecker<PlayerLike>;
    // 任务变更条件
    progressCondition?: ConditionChecker<PlayerLike>;
    // 任务完成条件
    finishCondition?: ConditionChecker<PlayerLike>;
}

// 任务目标, 带状态
export class TaskTarget {
    // 任务目标类型
    readonly type: string;
    // 任务目标数据
    readonly data?: any;
    // 目标进度值
    readonly targetProgressValue: number = 0;
    // 任务目标状态
    progress: number = 0;
    // 接取时间
    acceptTimeSecond: number = 0;

    constructor(config: TaskTargetConfig) {
        this.type = config.taskTargetType;
        this.data = config.data;
        this.targetProgressValue = config.targetProgressValue;
    }

    // 更新任务目标状态
    setProgress(value: number): void {
        this.progress = value;
    }

    addProgress(value: number): void {
        this.progress += value;
    }

}

/**
 * 任务类
 */
export class PlayerTask {
    // 当前任务阶段
    private currentPhase: TaskPhaseEnum = TaskPhaseEnum.noOpen;
    private taskTargets: TaskTarget[] = [];
    readonly config: TaskConfig

    constructor(config: TaskConfig,
                resetStateCallback: (task: PlayerTask) => void,
    ) {
        this.config = config
        this.init();

        resetStateCallback(this)
    }

    /**
     * 初始化任务，恢复历史状态数据
     */
    init(): void {
        // 根据 TaskConfig 中的 taskTargetList 构建 TaskTarget 实例
        let config: TaskConfig = this.config;

        this.taskTargets = config.taskTargetList
            .map((targetConfig) => {
                return this.createTaskTarget(targetConfig);
            });
    }

    /**
     * 获取当前任务阶段
     */
    get phase(): TaskPhaseEnum {
        return this.currentPhase;
    }

    /**
     * 完成任务
     */
    finish(player: PlayerLike): boolean {
        if (this.currentPhase === TaskPhaseEnum.inProgress) {
            if (!this.isHaveFinishAllTaskTarget()) {
                return false;
            }

            // 如果 finishCondition 不存在，视为条件满足
            const result = this.config.finishCondition ? this.config.finishCondition.verify(player) : ConditionResult.success();

            if (result.isSuccess()) {
                this.currentPhase = TaskPhaseEnum.finish;
            }

            return result.success;
        }

        return false; // Task not in the correct phase to finish
    }

    /**
     * 接受任务
     */
    accept(player: PlayerLike): boolean {
        if (this.currentPhase === TaskPhaseEnum.noOpen) {
            // 如果 acceptCondition 不存在，视为条件满足
            const result = this.config.acceptCondition ? this.config.acceptCondition.verify(player) : ConditionResult.success();

            if (result.isSuccess()) {
                this.currentPhase = TaskPhaseEnum.canAccept;
            }

            return result.success;
        }

        return false; // Already accepted or in other phases
    }

    /**
     * 开始任务
     */
    start(player: PlayerLike): boolean {
        if (this.currentPhase === TaskPhaseEnum.canAccept) {
            // 如果 progressCondition 不存在，视为条件满足
            const result = this.config.progressCondition ? this.config.progressCondition.verify(player) : ConditionResult.success();

            if (result.isSuccess()) {
                this.currentPhase = TaskPhaseEnum.inProgress;
            }

            return result.success;
        }

        return false; // Task not in the correct phase to start
    }

    /**
     * 检查任务目标进度是否满足条件
     */
    private isHaveFinishAllTaskTarget(): boolean {
        for (const target of this.taskTargets) {
            // 检查任务目标的进度是否达到目标值
            if (target.progress < target.targetProgressValue) {
                return false;
            }
        }

        return true;
    }

    /**
     * 领取奖励
     */
    claimReward(player: PlayerLike): boolean {
        if (this.currentPhase === TaskPhaseEnum.finish) {
            // 处理领取奖励的逻辑
            this.currentPhase = TaskPhaseEnum.reward;

            return true;
        }
        // Task not in the correct phase to claim reward
        return false;
    }

    /**
     * 获取任务目标状态信息
     */
    getTaskTargets(): TaskTarget[] {
        return this.taskTargets;
    }

    /**
     * 接收事件，根据事件名称分发给对应的处理器
     * @param playerLike 玩家
     * @param eventName 事件名称
     * @param eventData 事件数据
     */
    receiveEvent(playerLike: PlayerLike,
                 eventName: string,
                 eventData: any,
    ): void {
        // 处理每个任务目标
        this.taskTargets.forEach(target => {
            const targetTypeHandler = TaskTargetTypeRegister.getHandler(target.type);
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
        // 实际项目中可能需要根据配置创建具体的 TaskTarget 类型
        // 这里简化为创建基础的 TaskTarget
        return new TaskTarget(targetConfig);
    }
}

export interface TaskEventHandler<T> {

    handle(player: PlayerLike,
           target: TaskTarget,
           eventName: string,
           event: T
    ): void
}

// 定义任务目标类型处理器接口
export abstract class TaskTargetTypeHandler {

    protected eventTypeToEventHandlerMap = new Map<Clazz<any>, TaskEventHandler<any>>()

    constructor() {
        this.initEventTypeHandler()
    }

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
                       handler: TaskEventHandler<T>
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

