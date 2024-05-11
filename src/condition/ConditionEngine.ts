import {JsonUtils} from "../json/JsonUtils";

export class ConditionData {
    checkType: string;
    conditionGroup: { [key: string]: ConditionConfig[] };
}

export class ConditionConfig {
    type: string;
    data: any;
}

export abstract class Condition {
    type: string;
    data: any;

    abstract verify(target: any): boolean;
}

export interface ConditionApi<T = any> {
    verify(target: T): ConditionResult;
}

export interface ConditionCreator {
    create(type: string, data: any): ConditionApi;
}

export class ConditionChecker<T = any> {
    checkType: string;
    conditions: Map<string, ConditionApi<T>[]> = new Map();
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

    verify(target: T): ConditionResult {
        try {
            let success: boolean;

            if (this.conditions && this.conditions.size === 0) {
                return this.defaultResult;
            }

            const strategy = ConditionCheckerStrategyRegister.getStrategy(this.checkType);

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

interface ConditionCheckerStrategy {
    verify<T>(conditions: Map<string, ConditionApi<T>[]>, target: T): boolean;
}

class AndConditionCheckerStrategy implements ConditionCheckerStrategy {
    verify<T>(conditions: Map<string, ConditionApi<T>[]>, target: T): boolean {
        return Array.from(conditions.values()).every((conditionGroup) =>
            conditionGroup.every((condition) => condition.verify(target))
        );
    }
}

class OrConditionCheckerStrategy implements ConditionCheckerStrategy {
    verify<T>(conditions: Map<string, ConditionApi<T>[]>, target: T): boolean {
        return Array.from(conditions.values()).some((conditionGroup) =>
            conditionGroup.some((condition) => condition.verify(target))
        );
    }
}

class ConditionCheckerStrategyRegister {
    private static strategies: Map<string, ConditionCheckerStrategy> = new Map();

    static initialize(): void {
        this.registerStrategy("and", new AndConditionCheckerStrategy());
        this.registerStrategy("or", new OrConditionCheckerStrategy());
    }

    static registerStrategy(type: string, strategy: ConditionCheckerStrategy): void {
        this.strategies.set(type, strategy);
    }

    static getStrategy(type: string): ConditionCheckerStrategy | undefined {
        return this.strategies.get(type);
    }
}

ConditionCheckerStrategyRegister.initialize();

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

export class ConditionFactory<T = any> {
    private static _instance: ConditionFactory | null = null;
    private conditionCreators: Map<string, ConditionCreator> = new Map();

    private constructor() {}

    static get instance(): ConditionFactory {
        if (!ConditionFactory._instance) {
            ConditionFactory._instance = new ConditionFactory();
        }
        return ConditionFactory._instance;
    }

    register(type: string, creator: ConditionCreator): void {
        this.conditionCreators.set(type, creator);
    }

    createConditionChecker(
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

    createConditionApiFromJson(json: string): ConditionApi<T> | null {
        try {
            const conditionConfig: ConditionConfig = JsonUtils.deserialize(
                json,
                ConditionConfig
            );
            const conditionType: string = conditionConfig.type;
            const data = conditionConfig.data;
            const creator: ConditionCreator = this.conditionCreators.get(conditionType);

            if (!creator) {
                throw new Error(`No creator found for condition type: ${conditionType}`);
            }

            return creator.create(conditionType, data);
        } catch (error) {
            console.error('Error creating ConditionApi from JSON:', error);
            return null;
        }
    }

    private createConditionApi(conditionConfig: ConditionConfig): ConditionApi<T> {
        let conditionType: string = conditionConfig.type;
        let data = conditionConfig.data;
        let creator: ConditionCreator = this.conditionCreators.get(conditionType);
        if (!creator) {
            throw new Error(`没找到条件类型 creator. type = ${conditionType}`);
        }
        return creator.create(conditionType, data);
    }
}
