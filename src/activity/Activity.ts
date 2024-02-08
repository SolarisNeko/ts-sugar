import {DateTimeUtils} from "../time/DateTimeUtils";
import {Clazz} from "../types/Types";
import {ObjectUtils} from "../utils/ObjectUtils";

/**
 * 活动信息和状态的共同属性接口
 */
interface CommonActivityProperties {
    // 活动id
    activityId: number;
    // 活动类型
    activityType: string;
    // 开始时间
    startTimeMs: number;
    // 结束时间
    endTimeMs: number;
    // 第几次活动伦次
    turnCount: number;
    // 是否显示
    displayFlag: boolean;
    // 任意额外数据
    data: any;
}

/**
 * 活动阶段 enum
 */
export enum ActivityPhaseEnum {
    NotOpen,
    Open,
    Join,
    Balance,
    Close,
}

export abstract class ActivityTypeHandler<T> {
    // 活动任意数据的数据类型
    abstract getActivityAnyDataClass(): Clazz<T>;

    // 当活动显示时
    onActivityDisplay(): void {
    }

    onActivityStart(): void {
    }

    onActivityJoinTickPerSchedule(): void {
    }

    onActivityBalance(): void {
    }

    onActivityClose(): void {
    }
}

/**
 * 活动类型处理器工厂
 */
export class ActivityTypeHandlerFactory {
    private handlers: Map<string, ActivityTypeHandler<any>> = new Map();

    public static readonly instance = new ActivityTypeHandlerFactory();

    private constructor() {
    }


    registerHandler<T>(activityType: string, handler: ActivityTypeHandler<T>): void {
        this.handlers.set(activityType, handler);
    }

    getHandler<T>(activityType: string): ActivityTypeHandler<T> | undefined {
        return this.handlers.get(activityType) as ActivityTypeHandler<T> | undefined;
    }
}

/**
 * 活动状态数据
 */
export class ActivityStateData implements CommonActivityProperties {
    activityId: number;
    activityType: string;
    startTimeMs: number;
    endTimeMs: number;
    turnCount: number;
    displayFlag: boolean;
    data: any;
    dataType: Clazz<any>
    phase: ActivityPhaseEnum;
    joinFlag: boolean;

    constructor(commonProps: CommonActivityProperties, phase: ActivityPhaseEnum) {
        this.activityId = commonProps.activityId;
        this.phase = phase;
        this.startTimeMs = commonProps.startTimeMs;
        this.endTimeMs = commonProps.endTimeMs;
        this.turnCount = commonProps.turnCount;
        this.displayFlag = commonProps.displayFlag;
        this.data = commonProps.data;
        this.activityType = commonProps.activityType;

        let currentTimeMs: number = DateTimeUtils.getCurrentTimeMs();
        this.joinFlag = this.startTimeMs <= currentTimeMs && currentTimeMs <= this.endTimeMs
    }
}

/**
 * 活动信息
 */
export class ActivityInfo implements CommonActivityProperties {
    activityId: number;
    activityType: string;
    startTimeMs: number;
    endTimeMs: number;
    turnCount: number;
    displayFlag: boolean;
    joinFlag: boolean;
    data: any;

    constructor(commonProps: CommonActivityProperties) {
        this.activityId = commonProps.activityId;
        this.activityType = commonProps.activityType;
        this.startTimeMs = commonProps.startTimeMs;
        this.endTimeMs = commonProps.endTimeMs;
        this.turnCount = commonProps.turnCount;
        this.displayFlag = commonProps.displayFlag;
        this.data = commonProps.data;
    }

}

/**
 * 活动管理器
 */
export class ActivityManager {
    private activityIdMap: Map<number, ActivityStateData> = new Map();
    private scheduler: any | null = null; // Scheduler reference
    // 调度检查间隔
    checkActivityIntervalMs: number = 5000

    public static readonly instance = new ActivityManager();

    private constructor() {
    }

    /**
     * 添加活动
     * @param activityInfo 活动信息
     */
    addActivity(activityInfo: ActivityInfo): void {

        // 默认未开启
        const activityState = new ActivityStateData(activityInfo, ActivityPhaseEnum.NotOpen);
        let handler: ActivityTypeHandler<any> = ActivityTypeHandlerFactory.instance.getHandler(
            activityState.activityType,
        );

        if (!handler) {
            console.error(`没找到活动处理器 activityType = ${activityState.activityType}`);
        }

        // activity.data 转为类型对象
        let dataType: Clazz<any> = handler.getActivityAnyDataClass();
        let typeData: any = new dataType();
        ObjectUtils.copyProperty(activityState.data, typeData);
        activityState.data = typeData;
        activityState.dataType = dataType;

        // 刷新状态
        const currentTime = Date.now();
        this.refreshOneActivity(activityState, currentTime);

        this.activityIdMap.set(activityState.activityId, activityState);

    }

    /**
     * 移除活动
     * @param activityId 活动ID
     */
    removeActivity(activityId: number): void {
        this.activityIdMap.delete(activityId);
    }

    /**
     * 获取活动状态数据
     * @param activityId 活动ID
     * @returns 活动状态数据，若活动不存在则返回null
     */
    getActivityStateData(activityId: number): ActivityStateData | null {
        const activity = this.activityIdMap.get(activityId);

        if (activity) {
            const currentTime = Date.now();
            let phase: ActivityPhaseEnum;

            if (!activity.displayFlag) {
                phase = ActivityPhaseEnum.NotOpen;
            } else if (!activity.joinFlag) {
                phase = ActivityPhaseEnum.Open;
            } else if (currentTime < activity.endTimeMs) {
                phase = ActivityPhaseEnum.Join;
            } else if (currentTime <= activity.endTimeMs) {
                phase = ActivityPhaseEnum.Balance;
            } else {
                phase = ActivityPhaseEnum.Close;
            }

            return new ActivityStateData(activity, phase);
        }

        return null;
    }

    /**
     * 获取所有活动状态数据
     * @returns 所有活动状态数据的数组
     */
    getAllActivityStateData(): ActivityStateData[] {
        const result: ActivityStateData[] = [];

        for (const activity of this.activityIdMap.values()) {
            const stateData = this.getActivityStateData(activity.activityId);

            if (stateData) {
                result.push(stateData);
            }
        }

        return result;
    }

    /**
     * 重置调度器
     */
    public resetScheduler(): void {
        // 清除现有的调度器
        if (this.scheduler) {
            clearTimeout(this.scheduler);
            this.scheduler = null;
        }

        // 设置新的调度器
        this.scheduler = setTimeout(() => {
            // 更新所有活动状态
            this.updateActivityStates();

            this.resetScheduler();
        }, Math.max(this.checkActivityIntervalMs, 1000));
    }

    /**
     * 更新所有活动状态
     */
    private updateActivityStates(): void {
        const currentTime = Date.now();

        for (const [activityId, activity] of this.activityIdMap) {

            this.refreshOneActivity(activity, currentTime);

        }
    }

    private refreshOneActivity(activity: ActivityStateData, currentTime: number): void {
        if (!activity.displayFlag) {
            activity.phase = ActivityPhaseEnum.NotOpen;
            activity.joinFlag = false
        } else if (!activity.joinFlag) {
            activity.phase = ActivityPhaseEnum.Open;
            activity.joinFlag = false
        } else if (currentTime < activity.endTimeMs) {
            activity.phase = ActivityPhaseEnum.Join;
            activity.joinFlag = true
        } else if (currentTime <= activity.endTimeMs) {
            activity.phase = ActivityPhaseEnum.Balance;
            activity.joinFlag = false
        } else {
            activity.phase = ActivityPhaseEnum.Close;
            activity.joinFlag = false
        }
    }
}


