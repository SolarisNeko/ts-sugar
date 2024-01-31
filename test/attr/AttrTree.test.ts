import {AttrTree, AttrTreeCompareResult, AttrType} from "../../src/attr/AttrTree";

export namespace AttrTypeEnum {
    export const ATTACK = new AttrType(1, "atk");
    export const DEFENSE = new AttrType(2, "defense");
}


describe('AttrType', () => {
    test('calcFinalAttr should return totalMap if calculateFinalLambda is null', () => {
        const attrType = new AttrType(1, 'test', 2);
        const totalMap = new Map([[attrType, 10]]);

        const result = attrType.calcChangeAttrMap(totalMap);

        expect(result).toEqual(totalMap);
    });

    test('calcFinalAttr should apply calculateFinalLambda if present', () => {
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

    beforeEach(() => {
        attrTree = new AttrTree();
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
});
