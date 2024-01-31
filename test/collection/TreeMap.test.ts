import {TreeMap} from "../../src/collection/TreeMap";

describe('TreeMap', () => {
    let treeMap: TreeMap<number, string>;

    beforeEach(() => {
        treeMap = new TreeMap<number, string>();
    });

    test('put and get should insert and retrieve values correctly', () => {
        treeMap.put(1, 'one');
        treeMap.put(2, 'two');
        treeMap.put(3, 'three');

        expect(treeMap.get(1)).toBe('one');
        expect(treeMap.get(2)).toBe('two');
        expect(treeMap.get(3)).toBe('three');
    });

    test('remove should remove a key-value pair correctly', () => {
        treeMap.put(1, 'one');
        treeMap.put(2, 'two');
        treeMap.put(3, 'three');

        treeMap.remove(2);

        expect(treeMap.get(1)).toBe('one');
        expect(treeMap.get(2)).toBeNull();
        expect(treeMap.get(3)).toBe('three');
    });

    test('isEmpty should return true for an empty tree', () => {
        expect(treeMap.isEmpty()).toBe(true);

        treeMap.put(1, 'one');

        expect(treeMap.isEmpty()).toBe(false);
    });

    // Add more tests for other methods and edge cases as needed
});
