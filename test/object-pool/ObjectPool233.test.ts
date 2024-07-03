import {IPoolObject, ObjectPool233} from "../../src";

class TestObject implements IPoolObject {
    value: number;

    constructor(value: number = 0) {
        this.value = value;
    }

    onRecovery(): void {
        this.value = 0;
    }
}

describe("ObjectPool233", () => {
    beforeEach(() => {
        ObjectPool233.clearAll();
    });

    it("should allocate and recover objects", () => {
        const obj1 = ObjectPool233.allocate(TestObject);
        const obj2 = ObjectPool233.allocate(TestObject);
        expect(obj1).toBeInstanceOf(TestObject);
        expect(obj2).toBeInstanceOf(TestObject);

        ObjectPool233.recovery(obj1);
        ObjectPool233.recovery(obj2);

        const obj3 = ObjectPool233.allocate(TestObject);
        expect(obj3).toBe(obj1); // 从池中获取的应该是同一个对象
    });

    it("should respect MAX_POOL_SIZE", () => {
        for (let i = 0; i < ObjectPool233.MAX_POOL_SIZE; i++) {
            ObjectPool233.allocate(TestObject);
        }

        const obj = new TestObject();

        expect(ObjectPool233.recovery(obj)).toBe(true);
    });

    it("should allow setting custom max pool size", () => {
        ObjectPool233.setMaxPoolSizeByClass(TestObject, 5);
        for (let i = 0; i < 5; i++) {
            const obj = new TestObject();
            ObjectPool233.recovery(obj)
        }

        const obj = new TestObject();
        expect(ObjectPool233.recovery(obj)).toBe(false); // 超过自定义最大池大小，回收失败
    });

    it("should clear all objects", () => {
        ObjectPool233.allocate(TestObject);
        ObjectPool233.clearAll();
        expect(ObjectPool233.size()).toBe(0);
    });

    it("should clear objects by class", () => {
        ObjectPool233.allocate(TestObject);
        ObjectPool233.clearByClass(TestObject);

        expect(ObjectPool233.getPoolSizeByClass(TestObject)).toBe(0);
    });

    it("should call onRecovery when recovering an object", () => {
        const obj = ObjectPool233.allocate(TestObject);
        obj.value = 123;
        ObjectPool233.recovery(obj);
        expect(obj.value).toBe(0); // onRecovery 应该重置 value
    });

    it("should not allow null objects to be recovered", () => {
        expect(ObjectPool233.recovery(null)).toBe(false);
    });

    it("should handle non-IPoolObject objects", () => {
        class NonPoolObject implements IPoolObject {
            onRecovery(): void {
            }

        }

        const obj = new NonPoolObject();
        expect(ObjectPool233.recovery(obj)).toBe(true);
    });
});
