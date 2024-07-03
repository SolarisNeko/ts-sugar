import { MapUtils } from "../utils/MapUtils";

/**
 * 单个属性, 转化成其他属性 new Map
 */
export type IConvertAttrToOtherAttrMap = (thisValue: number,
                                          totalMap: Map<AttrType, number>
) => Map<AttrType, number> | null;


export interface IAttrTreePath {

    getAttrPathString(): string;
}


/**
 * 定义一个属性
 */
export class AttrType {
    // 属性id
    readonly id: number;
    // 属性名
    readonly name: string;
    // 计算先后顺序
    readonly order: number;
    // 将最终属性 -> 新增的战斗用的属性
    private readonly calculateFinalLambda?: IConvertAttrToOtherAttrMap;

    private static _nameToAttrMap: Map<string, AttrType> = new Map();

    /**
     *
     * @param id 属性id
     * @param name 属性名
     * @param order 计算先后顺序
     * @param calculateFinalLambda 将最终属性 -> 战斗用的属性
     */
    constructor(
        id: number,
        name: string,
        order: number = 1,
        calculateFinalLambda: IConvertAttrToOtherAttrMap = null,
    ) {
        this.id = id;
        this.name = name;
        this.order = order;
        this.calculateFinalLambda = calculateFinalLambda;
    }

    /**
     * 创建
     * @param id
     * @param name
     * @param order
     * @param calculateFinalLambda
     */
    static create(id: number,
                  name: string,
                  order: number = 1,
                  calculateFinalLambda: IConvertAttrToOtherAttrMap = null
    ): AttrType {
        const attrType = new AttrType(id, name, order, calculateFinalLambda);
        AttrType._nameToAttrMap.set(name, attrType);
        return attrType;
    }

    /**
     * 通过属性名获取属性类型
     * - 配置文件中定义的属性名, 都应该在这里注册
     * @param name
     */
    static getAttrTypeByName(name: string): AttrType | undefined {
        const attrType = AttrType._nameToAttrMap.get(name);
        if (!attrType) {
            console.error(`没有找到属性类型. name=${name}, attrType = `, attrType)
        }
        return attrType;
    }

    /**
     * 计算转换成什么属性 Map
     * - hp 百分比 -> 基于 hp 基本值计算出 -> 额外加成 Map[[HP, 100]]
     * @param totalMap
     */
    calcAddExtraAttrMap(totalMap: Map<AttrType, number>): Map<AttrType, number> | null {
        if (!totalMap) {
            return null;
        }
        if (this.calculateFinalLambda == null) {
            return totalMap
        }

        const value = totalMap.get(this);
        if (value == null || value == 0) {
            return null;
        }
        // 计算转换成什么属性
        return this.calculateFinalLambda(value, totalMap);
    }

    isEqualsTo(other: AttrType): boolean {
        return this.id === other.id;
    }
}


export class AttrTreeCompareResult<AttrType> {
    addPart: Map<AttrType, number>;
    noChangePart: Map<AttrType, number>;
    minusPart: Map<AttrType, number>;

    constructor() {
        this.addPart = new Map();
        this.noChangePart = new Map();
        this.minusPart = new Map();
    }
}


export class AttrTreeChangeResult<AttrType> {
    // 增加部分
    addPart: Map<AttrType, number>;
    // 无变化部分
    noChangePart: Map<AttrType, number>;
    // 减少部分
    minusPart: Map<AttrType, number>;
    // 老的属性树
    oldAttrMap: Map<AttrType, number>;
    // 新的属性树
    newAttrMap: Map<AttrType, number>;

    constructor(oldAttrMap: Map<AttrType, number>,
                newAttrMap: Map<AttrType, number>,
    ) {
        this.addPart = new Map();
        this.noChangePart = new Map();
        this.minusPart = new Map();
        this.oldAttrMap = oldAttrMap;
        this.newAttrMap = newAttrMap;
    }
}

export interface AttrTreeChangeListener<AttrType> {
    (result: AttrTreeChangeResult<AttrType>): void;
}

export class BaseAttrTree<Path extends IAttrTreePath> {


    static readonly SPLIT: string = "/";

    // 原生属性
    private _pathToAttrMap: Map<string, Map<AttrType, number>> = new Map();
    // 汇总属性. 用于展示用
    private _totalAttrMap: Map<AttrType, number> = new Map();
    // 最终应用于战斗属性. 此时将攻击力百分比, 转为固定攻击力. 100atk + 30%atk = 130点
    private _finalAttrMap: Map<AttrType, number> = new Map();
    // 属性变更的 listeners
    private _changeListeners: AttrTreeChangeListener<AttrType>[] = [];

    addChangeListener(listener: AttrTreeChangeListener<AttrType>): void {
        this._changeListeners.push(listener);
    }

    private notifyChangeListeners(result: AttrTreeChangeResult<AttrType>): void {
        for (const listener of this._changeListeners) {
            listener(result);
        }
    }

    setAttrs(path: Path, newAttrMap: Map<AttrType, number>): void {
        const pathKey = path.getAttrPathString();

        const oldFinalAttrMap = new Map(this._finalAttrMap);

        let oldAttrMap = this._pathToAttrMap.get(pathKey);

        // 增量更新
        this.updateAttrMapByPathIncremental(pathKey, oldAttrMap, newAttrMap)

        // 全量刷新总值
        this.refreshTotalAttrMap();

        // 计算最终值 | 将百分比加成 -> 固定基础值
        this.calculateFinal();

        // 对比新老的最终属性加成
        const newFinalAttrMap = new Map(this._finalAttrMap);
        const result = this.compareAttrs(oldFinalAttrMap, newFinalAttrMap);
        this.notifyChangeListeners(result);
    }

    private compareAttrs(
        oldAttrMap: Map<AttrType, number>,
        newAttrMap: Map<AttrType, number>,
    ): AttrTreeChangeResult<AttrType> {
        const result = new AttrTreeChangeResult<AttrType>(oldAttrMap, newAttrMap);

        for (const [attrType, value] of oldAttrMap.entries()) {
            const newValue = newAttrMap.get(attrType);
            if (newValue === undefined) {
                result.minusPart.set(attrType, value);
            } else if (newValue > value) {
                result.addPart.set(attrType, newValue - value);
            } else if (newValue < value) {
                result.minusPart.set(attrType, value - newValue);
            } else {
                result.noChangePart.set(attrType, value);
            }
        }

        for (const [attrType, value] of newAttrMap.entries()) {
            if (!oldAttrMap.has(attrType)) {
                result.addPart.set(attrType, value);
            }
        }

        return result;
    }

    setAttrValue(path: Path, attrType: AttrType, value: number): void {
        const attrs = new Map<AttrType, number>();
        attrs.set(attrType, value);
        this.setAttrs(path, attrs);
    }

    getAttrValue(path: Path, attrType: AttrType): number | undefined {
        const pathKey = path.getAttrPathString();
        const attrMap = this._pathToAttrMap.get(pathKey);
        return attrMap ? attrMap.get(attrType) : undefined;
    }

    getTotalAttrValue(attrType: AttrType): number {
        return this._totalAttrMap.get(attrType) || 0;
    }

    getFinalAttrValue(attrType: AttrType): number {
        return this._finalAttrMap.get(attrType) || 0;
    }

    private refreshTotalAttrMap(): void {
        this._totalAttrMap.clear();

        let allAttrMap = this._pathToAttrMap.get(BaseAttrTree.SPLIT) || new Map();
        this._totalAttrMap = new Map(allAttrMap);
    }

    private calculateFinal(): void {
        this._finalAttrMap.clear();

        // 排序后的执行顺序
        const sortedAttrTypes = [...this._totalAttrMap.keys()].sort((a, b) => {
            return a.order - b.order
        });

        // 每个类型, 特殊转化的其他属性
        let typeToChangeMap: Map<AttrType, Map<AttrType, number>> = new Map<AttrType, Map<AttrType, number>>();
        for (const attrType of sortedAttrTypes) {
            const translateAttrMap = attrType.calcAddExtraAttrMap(this._totalAttrMap);
            if (translateAttrMap == null) {
                continue;
            }
            typeToChangeMap.set(attrType, translateAttrMap)
        }

        typeToChangeMap.forEach((changeMap, type) => {
            MapUtils.mergeAll(
                this._finalAttrMap,
                (v1, v2) => v1 + v2,
                changeMap,
            )
        })
    }

    compare(targetAttrTree: BaseAttrTree<Path>): AttrTreeCompareResult<AttrType> {
        const result: AttrTreeCompareResult<AttrType> = new AttrTreeCompareResult();

        for (const [attrType, value] of this._totalAttrMap.entries()) {
            const targetValue = targetAttrTree.getTotalAttrValue(attrType);
            const targetType = [...targetAttrTree._totalAttrMap.keys()].find(t => this.areSameType(attrType, t));

            if (targetValue === undefined) {
                result.minusPart.set(attrType, value);
            } else if (targetType && targetValue > value) {
                result.addPart.set(attrType, targetValue - value);
            } else if (targetType && targetValue < value) {
                result.minusPart.set(attrType, value - targetValue);
            } else {
                result.noChangePart.set(attrType, value);
            }
        }

        for (const [attrType, value] of targetAttrTree._totalAttrMap.entries()) {
            const targetType = [...this._totalAttrMap.keys()]
                .find(t => this.areSameType(attrType, t));
            if (!this._totalAttrMap.has(targetType)) {
                result.addPart.set(attrType, value);
            }
        }

        return result;
    }

    private areSameType(type1: AttrType, type2: AttrType): boolean {
        return type1.isEqualsTo(type2);
    }

    /**
     * 增量更新属性
     * @param pathKey
     * @param oldAttrMap
     * @param newAttrMap
     * @private
     */
    private updateAttrMapByPathIncremental(pathKey: string,
                                           oldAttrMap: Map<AttrType, number>,
                                           newAttrMap: Map<AttrType, number>,
    ) {
        let attrMap = this._pathToAttrMap.get(pathKey);
        if (!attrMap) {
            attrMap = new Map();
            this._pathToAttrMap.set(pathKey, attrMap);
        }

        newAttrMap.forEach((value, attrType) => {
            attrMap!.set(attrType, value);
        });

        // 递归更新上层路径
        const prefixPathKey = this.getPrefixPathKey(pathKey);
        if (prefixPathKey == "/") {
            return;
        } else {
            this.updateAttrMapByPathIncremental(prefixPathKey, oldAttrMap, newAttrMap)
        }
    }

    /**
     * 获取上一个路径
     * @param pathKey
     * @private
     */
    private getPrefixPathKey(pathKey: string) {
        const index = pathKey.lastIndexOf(BaseAttrTree.SPLIT);
        if (index == -1 || index == 0) {
            return "/";
        } else {
            return pathKey.substring(0, index);
        }
    }
}
