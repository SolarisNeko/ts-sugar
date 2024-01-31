import {HashMap} from "../../src/collection/HashMap";

describe('HashMap', () => {
    let hashMap: HashMap<string, number>;

    beforeEach(() => {
        // Initialize a new HashMap before each test
        hashMap = new HashMap<string, number>();
    });

    test('should insert and retrieve values correctly', () => {
        hashMap.put('one', 1);
        hashMap.put('two', 2);

        expect(hashMap.get('one')).toBe(1);
        expect(hashMap.get('two')).toBe(2);
        expect(hashMap.get('nonexistent')).toBeNull();
    });

    test('should remove values correctly', () => {
        hashMap.put('one', 1);
        hashMap.put('two', 2);

        hashMap.remove('one');
        expect(hashMap.get('one')).toBeNull();
        expect(hashMap.get('two')).toBe(2);

        hashMap.remove('nonexistent'); // Removing a nonexistent key should not throw an error
    });

    test('should merge values correctly', () => {
        // Initialize a HashMap with a remapping function that doubles the value
        const remappingFunction = (v1, v2) => v1 + v2;
        hashMap.merge('one', 1, remappingFunction);
        expect(hashMap.get('one')).toBe(1);

        // Merge again to see if the remapping function is applied
        hashMap.merge('one', 2, remappingFunction);
        expect(hashMap.get('one')).toBe(3);
    });

    test('should resize when exceeding load factor', () => {
        // Set a small initial capacity for testing purposes
        const smallCapacityHashMap = new HashMap<string, number>(2);

        smallCapacityHashMap.put('one', 1);
        smallCapacityHashMap.put('two', 2);
        smallCapacityHashMap.put('three', 3);

        // Check if resizing occurred and all elements are still present
        expect(smallCapacityHashMap.get('one')).toBe(1);
        expect(smallCapacityHashMap.get('two')).toBe(2);
        expect(smallCapacityHashMap.get('three')).toBe(3);
    });
});
