import {JsonUtils} from "../json/JsonUtils";
import {AbstractSingleton} from "../core/AbstractSingleton";

/**
 * 条件数据
 */
export class ConditionData {
    checkType: string;
    conditionGroup: { [key: string]: ConditionConfig[] };
}

/**
 * 条件配置
 */
export class ConditionConfig {
    type: string;
    data: any;
}

/**
 * 条件
 */
export abstract class AbstractCondition {
    // 条件类型
    type: string;
    // 条件数据
    data: any;

    abstract verify(target: any): boolean;
}

/**
 * 条件 API
 */
export interface ConditionApi<T = any> {
    verify(target: T): ConditionResult;
}

/**
 * 条件创造器
 */
export interface ConditionCreator {
    create(type: string, data: any): ConditionApi;
}

/**
 * 条件检查器
 */
export class ConditionChecker<T = any> {
    // 检查类型
    checkType: string;
    // 条件组
    conditions: Map<string, ConditionApi<T>[]> = new Map();
    // 默认结果
    defaultResult: ConditionResult;

    constructor(
        checkType: string,
        conditions: Map<string, ConditionApi<T>[]>,
        defaultResult: ConditionResult
    ) {
        this.checkType = checkType;
        this.conditions = conditions;
        this.defaultResult = defaultResult;
    }

    /**
     * 校验对象, 返回结果
     * @param target
     */
    verify(target: T): ConditionResult {
        try {
            let success: boolean;

            if (this.conditions && this.conditions.size === 0) {
                return this.defaultResult;
            }

            const strategy = ConditionCheckerRegister.instance().getStrategy(this.checkType);

            if (strategy) {
                success = strategy.verify(this.conditions, target);
            } else {
                console.error(`Unsupported checkType: ${this.checkType}`);
                success = false;
            }

            return new ConditionResult(success);
        } catch (error) {
            console.error('Error verifying conditions:', error);
            return this.defaultResult;
        }
    }
}

/**
 * 条件检查策略
 */
export interface IConditionCheckerStrategy {
    // 检查条件
    verify<T>(conditions: Map<string, ConditionApi<T>[]>, target: T): boolean;
}

/**
 * 所有条件都满足
 */
class AndConditionCheckerStrategy implements IConditionCheckerStrategy {
    verify<T>(conditions: Map<string, ConditionApi<T>[]>, target: T): boolean {
        return Array.from(conditions.values()).every((conditionGroup) =>
            conditionGroup.every((condition) => condition.verify(target))
        );
    }
}

/**
 * or 条件组任意一个即可
 */
class OrConditionCheckerStrategy implements IConditionCheckerStrategy {
    verify<T>(conditions: Map<string, ConditionApi<T>[]>, target: T): boolean {
        return Array.from(conditions.values()).some((conditionGroup) =>
            conditionGroup.some((condition) => condition.verify(target))
        );
    }
}

/**
 * 条件检查策略注册
 */
export class ConditionCheckerRegister extends AbstractSingleton {
    private _strategies: Map<string, IConditionCheckerStrategy> = new Map();

    init(): void {
        this.registerStrategy("and", new AndConditionCheckerStrategy());
        this.registerStrategy("or", new OrConditionCheckerStrategy());
    }

    registerStrategy(type: string, strategy: IConditionCheckerStrategy): void {
        this._strategies.set(type, strategy);
    }

    getStrategy(type: string): IConditionCheckerStrategy | undefined {
        return this._strategies.get(type);
    }
}

ConditionCheckerRegister.instance().init();

/**
 * 条件结果
 */
export class ConditionResult {
    success: boolean;

    constructor(success: boolean) {
        this.success = success;
    }

    isSuccess(): boolean {
        return this.success;
    }

    static success(): ConditionResult {
        return new ConditionResult(true);
    }

    static fail(): ConditionResult {
        return new ConditionResult(false);
    }
}

/**
 * 条件工程
 */
export class ConditionFactory extends AbstractSingleton {

    private _conditionCreators: Map<string, ConditionCreator> = new Map();

    /**
     * 注册条件创造器
     * @param type
     * @param creator
     */
    register(type: string, creator: ConditionCreator): void {
        this._conditionCreators.set(type, creator);
    }

    /**
     * 创建检查器
     * @param jsonConfig
     * @param defaultResult
     * @param eatErrorFlag
     */
    createConditionChecker<T>(
        jsonConfig: string,
        defaultResult: ConditionResult = ConditionResult.fail(),
        eatErrorFlag: boolean = true
    ): ConditionChecker<T> {
        try {
            const conditionData: ConditionData = JsonUtils.deserialize(jsonConfig, ConditionData);
            const checkType: string = conditionData.checkType;
            const conditionGroup: { [key: string]: ConditionConfig[] } = conditionData.conditionGroup;

            if (Object.keys(conditionGroup).length === 0) {
                return new ConditionChecker(checkType, new Map(), defaultResult);
            }

            const conditions: Map<string, ConditionApi<T>[]> = new Map();

            for (const groupId in conditionGroup) {
                if (conditionGroup.hasOwnProperty(groupId)) {
                    const conditionArray: ConditionConfig[] = conditionGroup[groupId];
                    const conditionApiArray: ConditionApi<T>[] = conditionArray.map(
                        (conditionConfig) => {
                            return this.createConditionApi(conditionConfig);
                        }
                    );
                    conditions.set(groupId, conditionApiArray);
                }
            }

            return new ConditionChecker(checkType, conditions, defaultResult);
        } catch (error) {
            if (!eatErrorFlag) {
                console.error(`创建条件检查器失败! create ConditionChecker error! JSON = ${jsonConfig}`, error);
            }
            return new ConditionChecker("and", new Map(), defaultResult);
        }
    }

    /**
     * 通过 JSON 创建条件
     * @param json
     */
    createConditionApiFromJson<T>(json: string): ConditionApi<T> | null {
        try {
            const conditionConfig: ConditionConfig = JsonUtils.deserialize(
                json,
                ConditionConfig
            );
            const conditionType: string = conditionConfig.type;
            const data = conditionConfig.data;
            const creator: ConditionCreator = this._conditionCreators.get(conditionType);

            if (!creator) {
                throw new Error(`No creator found for condition type: ${conditionType}`);
            }

            return creator.create(conditionType, data);
        } catch (error) {
            console.error('Error creating ConditionApi from JSON:', error);
            return null;
        }
    }

    /**
     * 创建条件 API
     * @param conditionConfig
     * @private
     */
    private createConditionApi<T>(conditionConfig: ConditionConfig): ConditionApi<T> {
        let conditionType: string = conditionConfig.type;
        let data = conditionConfig.data;
        let creator: ConditionCreator = this._conditionCreators.get(conditionType);
        if (!creator) {
            throw new Error(`没找到条件类型 creator. type = ${conditionType}`);
        }
        return creator.create(conditionType, data);
    }
}
