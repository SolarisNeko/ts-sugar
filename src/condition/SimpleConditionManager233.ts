import {Clazz} from "../types/Types";
import {AbstractSingleton} from "../core/AbstractSingleton";
import {Logger} from "../logger/Logger";

/**
 * 单个游戏条件
 */
export interface ISimpleCondition {

    // 初始化参数
    initParams(params: string, targetCount: number): void

    // 检查条件
    check(): boolean;
}


/**
 * 游戏条件管理器
 *
 * 接入方式:
 * 1. 在 impl/ 目录下, 编写一个 class 实现 ICondition 接口
 * 2. 在 ConditionManager.ts 的 onInit() 方法中, 注册该条件类型
 *
 * Config:
 * 条件文本格式 =  ${type}, ${params}, ${numberCount}; ${type}, ${params}, ${numberCount};...
 * demo = playerLvGreaterThan, 0 ,10; playerLvLessThan, 0, 50
 * -----
 * Code:
 * const isOK: boolean = ConditionManager.ins().checkCondition(条件文本)
 */
export class SimpleConditionManager233 extends AbstractSingleton {

    // <条件名, 条件类>
    private _typeToCreateConditionMap: Map<string, Clazz<ISimpleCondition>> = new Map();

    // 后续缓存优化用 | 暂未用到
    private _conditionCacheMap: Map<string, Array<ISimpleCondition>> = new Map();


    // 初始化注册所有枚举
    protected onInit() {
        super.onInit();
    }

    registerCondition(conditionType: string, clazz: Clazz<ISimpleCondition>): void {
        this._typeToCreateConditionMap.set(conditionType, clazz);
    }

    /**
     * 解析条件文本
     * @param conditionText 条件文本
     */
    parseConditionText(conditionText: string): Array<ISimpleCondition> {
        const conditionTextArray = conditionText.split(";")
            .toDataStream()
            .filter((it) => it.trim().length > 0)
            .toArray();
        if (conditionTextArray.length === 0) {
            return []
        }
        // 解析每一个条件
        const array = conditionTextArray.toDataStream()
            .filter((it) => it.trim().length > 0)
            .map((it) => {
                const oneConditionArray = it.split(",");
                if (oneConditionArray.length !== 3) {
                    return null;
                }

                const conditionType = oneConditionArray[0].trim();
                const params = oneConditionArray[1].trim();
                const targetValue = Number.parseInt(oneConditionArray[2].trim());

                const conditionCreator = this._typeToCreateConditionMap.get(conditionType);
                if (!conditionCreator) {
                    Logger.DEFAULT.error(`前端条件类型不存在, 检查一下是否漏接后端新增的条件了. conditionType: ${conditionType}`)
                    return null;
                }
                const condition = new conditionCreator();

                // 初始化条件
                condition.initParams(params, targetValue)

                return condition
            })
            .filterNotNull()
            .toArray();

        if (conditionTextArray.length !== array.length) {
            Logger.DEFAULT.error(`条件格式存在错误, 返回数组长度不匹配, conditionText: ${conditionText}`);
        }

        return array
    }

    /**
     * 检查【游戏条件】是否满足
     * @param conditionText 条件文本 | 参考 ItemComeFromConfig.unlockCondition: string = "[[1,0,100]]"
     * @param defaultOkFlag 默认是否成功 | default true
     */
    checkCondition(conditionText: string, defaultOkFlag: boolean = true): boolean {
        if (!conditionText) {
            Logger.DEFAULT.warn(`条件文本为 null, defaultOkFlag = ${defaultOkFlag}, conditionText = ${conditionText}`);
            return defaultOkFlag
        }
        const conditionArray = this.parseConditionText(conditionText);

        // safe check
        let okFlag = defaultOkFlag;
        try {
            for (let i = 0; i < conditionArray.length; i++) {
                const condition = conditionArray[i];

                // 检查条件
                const isOk = condition.check();
                okFlag = okFlag && isOk;

                if (!isOk) {
                    break;
                }
            }
        } catch (error) {
            Logger.DEFAULT.error(`条件格式错误, conditionText = ${conditionText} | defaultOkFlag = ${defaultOkFlag}`, error);
            return defaultOkFlag;
        }

        return okFlag;
    }

}
