import {ObjectPool} from "../../src/objectPool/ObjectPool";

describe('ObjectPool', () => {
    let objectPool: ObjectPool<{ id: number }>;

    beforeEach(() => {
        objectPool = new ObjectPool(
            "demo",
            5,
            () => ({id: 0}),
            (item) => {
                // Mock cleanUp function
                item.id = -1;
                return item
            },
        );
    });

    it('should allocate an object', () => {
        const obj = objectPool.allocate();
        expect(obj).toHaveProperty('id', 0);
    });

    it('should free an object', () => {
        const obj = objectPool.allocate();
        objectPool.free(obj);
        expect(obj).toHaveProperty('id', -1);
    });

    it('should reuse released objects', () => {
        const obj1 = objectPool.allocate();
        objectPool.free(obj1);
        const obj2 = objectPool.allocate();
        expect(obj2).toBe(obj1);
    });

    it('should respect maxSize', () => {
        const objArray: {
            id: number
        }[] = [];

        // Acquire objects until maxSize is reached
        for (let i = 0; i < 10; i++) {
            let items = objectPool.allocate();
            items.id = i
            objArray.push(items);
        }

        // Release one object
        objectPool.free(objArray[0]);

        // Acquiring one more should not exceed maxSize
        const newObj = objectPool.allocate();
        expect(objArray).toContain(newObj);
    });
});
