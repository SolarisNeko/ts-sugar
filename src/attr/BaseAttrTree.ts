import {MapUtils} from "../utils/MapUtils";

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
    // 将最终属性 -> 战斗用的属性
    private readonly calculateFinalLambda?: (totalMap: Map<AttrType, number>) => Map<AttrType, number>;

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
        calculateFinalLambda: (totalMap: Map<AttrType, number>) => Map<AttrType, number> = null,
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
                  calculateFinalLambda: (totalMap: Map<AttrType, number>) => Map<AttrType, number> = null
    ): AttrType {
        return new AttrType(id, name, order, calculateFinalLambda);
    }


    calcChangeAttrMap(totalMap: Map<AttrType, number>): Map<AttrType, number> {
        if (!totalMap) {
            return new Map()
        }
        if (this.calculateFinalLambda == null) {
            return totalMap
        }
        return this.calculateFinalLambda(totalMap);
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
    addPart: Map<AttrType, number>;
    noChangePart: Map<AttrType, number>;
    minusPart: Map<AttrType, number>;
    oldAttrMap: Map<AttrType, number>;
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

export class BaseAttrTree<Path> {
    // 原生属性
    private pathToAttrMap: Map<Path, Map<AttrType, number>> = new Map();
    // 汇总属性. 用于展示用
    private totalAttrMap: Map<AttrType, number> = new Map();
    // 最终应用于战斗属性. 此时将攻击力百分比, 转为固定攻击力. 100atk + 30%atk = 130点
    private finalAttrMap: Map<AttrType, number> = new Map();
    // 属性变更的 listeners
    private changeListeners: AttrTreeChangeListener<AttrType>[] = [];

    addChangeListener(listener: AttrTreeChangeListener<AttrType>): void {
        this.changeListeners.push(listener);
    }

    private notifyChangeListeners(result: AttrTreeChangeResult<AttrType>): void {
        for (const listener of this.changeListeners) {
            listener(result);
        }
    }

    setAttrs(path: Path, attrs: Map<AttrType, number>): void {
        const oldAttrMap = new Map(this.finalAttrMap);
        let attrMap = this.pathToAttrMap.get(path);
        if (!attrMap) {
            attrMap = new Map();
            this.pathToAttrMap.set(path, attrMap);
        }

        attrs.forEach((value, attrType) => {
            attrMap!.set(attrType, value);
        });

        this.updateTotalAttrMap();
        this.calculateFinal();

        const newAttrMap = new Map(this.finalAttrMap);
        const result = this.compareAttrs(oldAttrMap, newAttrMap);
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
        const attrMap = this.pathToAttrMap.get(path);
        return attrMap ? attrMap.get(attrType) : undefined;
    }

    getTotalAttrValue(attrType: AttrType): number {
        return this.totalAttrMap.get(attrType) || 0;
    }

    getFinalAttrValue(attrType: AttrType): number {
        return this.finalAttrMap.get(attrType) || 0;
    }

    private updateTotalAttrMap(): void {
        this.totalAttrMap.clear();

        for (const attrMap of this.pathToAttrMap.values()) {
            for (const [attrType, value] of attrMap.entries()) {
                this.totalAttrMap.set(attrType, (this.totalAttrMap.get(attrType) || 0) + value);
            }
        }
    }

    private calculateFinal(): void {
        this.finalAttrMap.clear();

        const sortedAttrTypes = [...this.totalAttrMap.keys()].sort((a, b) => {
            return a.order - b.order
        });

        let typeToChangeMap: Map<AttrType, Map<AttrType, number>> = new Map<AttrType, Map<AttrType, number>>();
        for (const attrType of sortedAttrTypes) {
            const changeMap = attrType.calcChangeAttrMap(this.totalAttrMap);
            typeToChangeMap.set(attrType, changeMap)
        }

        typeToChangeMap.forEach((changeMap, type) => {
            MapUtils.mergeAll(this.finalAttrMap,
                (v1, v2) => v1 + v2,
                changeMap,
            )
        })
    }

    compare(targetAttrTree: BaseAttrTree<Path>): AttrTreeCompareResult<AttrType> {
        const result: AttrTreeCompareResult<AttrType> = new AttrTreeCompareResult();

        for (const [attrType, value] of this.totalAttrMap.entries()) {
            const targetValue = targetAttrTree.getTotalAttrValue(attrType);
            const targetType = [...targetAttrTree.totalAttrMap.keys()].find(t => this.areSameType(attrType, t));

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

        for (const [attrType, value] of targetAttrTree.totalAttrMap.entries()) {
            const targetType = [...this.totalAttrMap.keys()]
                .find(t => this.areSameType(attrType, t));
            if (!this.totalAttrMap.has(targetType)) {
                result.addPart.set(attrType, value);
            }
        }

        return result;
    }

    private areSameType(type1: AttrType, type2: AttrType): boolean {
        return type1.isEqualsTo(type2);
    }
}
