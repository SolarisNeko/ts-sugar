// objectPool.test.ts


import ObjectPool from "../../src/object-pool/ObjectPool";

describe('ObjectPool', () => {
    let objectPool: ObjectPool<{ id: number }>;

    beforeEach(() => {
        objectPool = new ObjectPool(
            () => ({id: 0}),
            (item) => {
                // Mock cleanUp function
                item.id = -1;
            },
            5
        );
    });

    it('should acquire an object', () => {
        const obj = objectPool.acquire();
        expect(obj).toHaveProperty('id', 0);
    });

    it('should release an object', () => {
        const obj = objectPool.acquire();
        objectPool.release(obj);
        expect(obj).toHaveProperty('id', -1);
    });

    it('should reuse released objects', () => {
        const obj1 = objectPool.acquire();
        objectPool.release(obj1);
        const obj2 = objectPool.acquire();
        expect(obj2).toBe(obj1);
    });

    it('should respect maxSize', () => {
        const objArray: {
            id: number
        }[] = [];

        // Acquire objects until maxSize is reached
        for (let i = 0; i < 10; i++) {
            let items = objectPool.acquire();
            items.id = i
            objArray.push(items);
        }

        // Release one object
        objectPool.release(objArray[0]);

        // Acquiring one more should not exceed maxSize
        const newObj = objectPool.acquire();
        expect(objArray).toContain(newObj);
    });
});
