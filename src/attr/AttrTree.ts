import {MapUtils} from "../utils/MapUtils";

export class AttrType {
    readonly id: number;
    readonly name: string;
    readonly order: number;
    private readonly calculateFinalLambda?: (totalMap: Map<AttrType, number>) => Map<AttrType, number>;

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

export class AttrTree<Path> {
    private pathToAttrMap: Map<Path, Map<AttrType, number>> = new Map();
    private totalAttrMap: Map<AttrType, number> = new Map();
    private finalAttrMap: Map<AttrType, number> = new Map();

    setAttrs(path: Path, attrs: Map<AttrType, number>): void {
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

    compare(targetAttrTree: AttrTree<Path>): AttrTreeCompareResult<AttrType> {
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
