import {AttrTree, AttrTreeChangeResult, AttrTreeCompareResult, AttrType} from "../../src/attr/AttrTree";
import {MapUtils} from "../../src/utils/MapUtils";

export namespace AttrTypeEnum {
    export const ATTACK = new AttrType(1, "atk");
    export const DEFENSE = new AttrType(2, "defense");
}

describe('AttrType', () => {
    test('calcChangeAttrMap should return totalMap if calculateFinalLambda is null', () => {
        const attrType = new AttrType(1, 'test', 2);
        const totalMap = new Map([[attrType, 10]]);

        const result = attrType.calcChangeAttrMap(totalMap);

        expect(result).toEqual(totalMap);
    });

    test('calcChangeAttrMap should apply calculateFinalLambda if present', () => {
        const calculateFinalLambda = (totalMap: Map<AttrType, number>) => {
            const result = new Map<AttrType, number>();
            totalMap.forEach((value, key) => result.set(key, value * 2));
            return result;
        };

        const attrType = new AttrType(1, 'test', 2, calculateFinalLambda);
        const totalMap = new Map([[attrType, 10]]);

        const result = attrType.calcChangeAttrMap(totalMap);

        expect(result.get(attrType)).toBe(20);
    });

    test('isEqualsTo should return true for equal instances', () => {
        const attrType1 = new AttrType(1, 'test1');
        const attrType2 = new AttrType(1, 'test2');

        const result = attrType1.isEqualsTo(attrType2);

        expect(result).toBe(true);
    });

    test('isEqualsTo should return false for different instances', () => {
        const attrType1 = new AttrType(1, 'test1');
        const attrType2 = new AttrType(2, 'test2');

        const result = attrType1.isEqualsTo(attrType2);

        expect(result).toBe(false);
    });
});

describe('AttrTree', () => {
    let attrTree: AttrTree<string>;
    let listenerMock: jest.Mock;

    beforeEach(() => {
        attrTree = new AttrTree();
        listenerMock = jest.fn();
    });

    test('setAttrs should set attributes for a path', () => {
        const path = 'player1';
        const attrs = new Map([[AttrTypeEnum.ATTACK, 50], [AttrTypeEnum.DEFENSE, 30]]);

        attrTree.setAttrs(path, attrs);

        expect(attrTree.getAttrValue(path, AttrTypeEnum.ATTACK)).toBe(50);
        expect(attrTree.getAttrValue(path, AttrTypeEnum.DEFENSE)).toBe(30);
    });

    test('setAttrValue should set a single attribute for a path', () => {
        const path = 'player1';

        attrTree.setAttrValue(path, AttrTypeEnum.ATTACK, 50);

        expect(attrTree.getAttrValue(path, AttrTypeEnum.ATTACK)).toBe(50);
    });

    test('getTotalAttrValue should return total attribute value', () => {
        const path = 'player1';
        const attrs = new Map([[AttrTypeEnum.ATTACK, 50], [AttrTypeEnum.DEFENSE, 30]]);

        attrTree.setAttrs(path, attrs);

        expect(attrTree.getTotalAttrValue(AttrTypeEnum.ATTACK)).toBe(50);
        expect(attrTree.getTotalAttrValue(AttrTypeEnum.DEFENSE)).toBe(30);
    });

    test('compare should return correct result', () => {
        const myAttrTree = new AttrTree();
        myAttrTree.setAttrs('player1', new Map([[AttrTypeEnum.ATTACK, 50], [AttrTypeEnum.DEFENSE, 30]]));

        const targetAttrTree = new AttrTree();
        targetAttrTree.setAttrs('player1', new Map([[AttrTypeEnum.ATTACK, 70], [AttrTypeEnum.DEFENSE, 30]]));

        const compareResult: AttrTreeCompareResult<AttrType> = myAttrTree.compare(targetAttrTree);

        expect(compareResult.addPart.get(AttrTypeEnum.ATTACK)).toBe(20);
        expect(compareResult.noChangePart.get(AttrTypeEnum.DEFENSE)).toBe(30);
    });

    test('notifyChangeListeners should call all listeners with correct result', () => {
        const path = 'player1';
        const attrs = new Map([[AttrTypeEnum.ATTACK, 50]]);
        const result: AttrTreeChangeResult<AttrType> = {
            addPart: new Map([[AttrTypeEnum.ATTACK, 50]]),
            noChangePart: new Map(),
            minusPart: new Map(),
            oldAttrMap: new Map(),
            newAttrMap: new Map([[AttrTypeEnum.ATTACK, 50]]),
        };

        attrTree.addChangeListener(listenerMock);
        attrTree.setAttrs(path, attrs);

        expect(listenerMock).toHaveBeenCalledWith(result);
    });

    test('attrTree change listener', () => {
        const path = 'player1/equip/3';

        const attrs1 = new Map([[AttrTypeEnum.ATTACK, 50]]);
        const attrs2 = new Map([[AttrTypeEnum.ATTACK, 100]]);

        let r
        attrTree.addChangeListener((result) => {
            r = result
        });

        attrTree.setAttrs(path, attrs1);
        attrTree.setAttrs(path, attrs2);


        const diffMap = new Map();

        MapUtils.mergeAll(
            diffMap,
            (v1, v2) => v1 + v2,
            attrs2,
        )
        MapUtils.mergeAll(
            diffMap,
            (v1, v2) => v1 - v2,
            attrs1,
        )

        expect(diffMap.get(AttrTypeEnum.ATTACK)).toBe(50);

    });
});
