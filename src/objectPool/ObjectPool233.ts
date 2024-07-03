import {Clazz} from "../types/Types";


/**
 * 对象必须是无参构造函数
 */
export interface IPoolObject {
    /**
     * 当回收对象, 清空字段
     */
    onRecovery(): void;
}

/**
 * 实现对象池接口的类，用于管理对象的分配和释放。
 */
export class ObjectPool233 {

    private static _classToPoolArrayMap: Map<Clazz<any>, any[]> = new Map();
    private static _classToMaxSizeMap: Map<Clazz<any>, number> = new Map();

    // 默认池大小
    public static MAX_POOL_SIZE = 1;

    /**
     * 设置最大池大小
     * @param clazz
     * @param maxSize
     */
    static setMaxPoolSizeByClass<T extends IPoolObject>(clazz: Clazz<T>, maxSize: number): void {
        this._classToMaxSizeMap.set(clazz, Math.max(maxSize, 0));
    }

    /**
     * 取出一个对象
     * @param classZ Class
     * @return Object
     */
    public static allocate<T>(classZ: Clazz<T>): T {
        let list = ObjectPool233._classToPoolArrayMap.get(classZ);
        // 有数据
        if (list?.length) {
            return list.pop() as T;
        }
        return new classZ();
    }

    /**
     * 回收一个对象
     * 对象需要包含 onRecovery 方法，或者手动清理对象数据
     * @param obj
     */
    public static recovery<T extends IPoolObject>(obj: T): boolean {
        if (obj == null) {
            return false;
        }

        const classZ = obj.constructor as Clazz<any>;
        if (!ObjectPool233._classToPoolArrayMap.has(classZ)) {
            ObjectPool233._classToPoolArrayMap.set(classZ, []);
        }

        obj.onRecovery();

        let array = ObjectPool233._classToPoolArrayMap.get(classZ);
        // max
        const maxSize = ObjectPool233._classToMaxSizeMap.getOrDefault(classZ, ObjectPool233.MAX_POOL_SIZE);
        if (array.length >= maxSize) {
            return false;
        }
        array!.push(obj);
        return true;
    }

    /**
     * 清除所有对象
     */
    public static clearAll(): void {
        ObjectPool233._classToPoolArrayMap.clear();
    }

    /**
     * 清空某一类对象
     * @param classZ Class
     */
    public static clearByClass<T extends IPoolObject>(classZ: Clazz<T>): void {
        ObjectPool233._classToPoolArrayMap.delete(classZ);
    }

    static size(): number {
        return this._classToPoolArrayMap.size;
    }

    /**
     * 获取池中对象的数量 by Class
     * @param clazz
     */
    static getPoolSizeByClass<T extends IPoolObject>(clazz: Clazz<T>): number {
        return this._classToPoolArrayMap.get(clazz)?.length || 0;
    }
}
