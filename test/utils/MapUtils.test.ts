import {MapUtils} from "../../src/utils/MapUtils";

describe('MapUtils', () => {
    let sampleMap: Map<number, string>;

    beforeEach(() => {
        sampleMap = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);
    });

    test('empty should return an empty map', () => {
        const result = MapUtils.empty();
        expect(result.size).toBe(0);
    });

    test('mergeAll should merge multiple maps', () => {
        const otherMap1 = new Map([[2, 'newTwo'], [4, 'four']]);
        const otherMap2 = new Map([[3, 'newThree'], [5, 'five']]);

        const result = MapUtils.mergeAll(sampleMap,
            (existing, newValue) => `${existing}_${newValue}`,
            otherMap1,
            otherMap2);

        expect(result.get(1)).toBe('one');
        expect(result.get(2)).toBe('two_newTwo');
        expect(result.get(3)).toBe('three_newThree');
        expect(result.get(4)).toBe('four');
        expect(result.get(5)).toBe('five');
    });

    // Add more tests for other methods as needed
});
