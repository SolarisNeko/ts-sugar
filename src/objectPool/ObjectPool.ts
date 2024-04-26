/**
 * 定义一个对象池接口，用于管理对象的分配和释放。
 */
interface IObjectPool<T> {

    /**
     * 获取对象池的名称。
     */
    get name(): string;

    /**
     * 分配一个对象，并返回该对象。
     */
    allocate(): T;

    /**
     * 释放一个对象。
     * @param inst - 要释放的对象。
     * @returns - 如果释放成功，则返回 true；否则返回 false。
     */
    free(inst: T): boolean;

    /**
     * 获取对象池的最大容量。
     */
    get max(): number;
}

/**
 * 实现对象池接口的类，用于管理对象的分配和释放。
 */
export class ObjectPool<T> implements IObjectPool<T> {
    // 对象池名字
    private readonly _name: string = null;
    // 最大数量
    private readonly _max: number = 0;
    // 创建对象函数
    private _creatorFunc: () => void = null;
    private readonly _freeFunction: (item: T) => T = null;

    // 数据
    private _data: Array<T> = null;

    /**
     * 创建一个对象池实例。
     * @param name - 对象池的名称。
     * @param maxCount - 对象池的最大容量。
     * @param creatorFunc - 对象的构造函数。
     * @param freeFunction - 释放函数
     */
    constructor(name: string,
                maxCount: number,
                creatorFunc: () => void,
                freeFunction: (item: T) => T = null,
    ) {
        this._name = name;
        this._max = maxCount;
        this._creatorFunc = creatorFunc;
        this._freeFunction = freeFunction;
        this._data = new Array<T>();
    }

    /**
     * 分配一个对象。
     * @returns - 返回分配的对象。
     */
    allocate(): T {
        if (this._data.length > 0) {
            return this._data.pop();
        }
        return this._creatorFunc.apply(this, arguments);
    };

    /**
     * 释放一个对象。
     * @param obj - 要释放的对象。
     * @returns - 如果释放成功，则返回 true；否则返回 false。
     */
    free(obj: T): boolean {
        if (this._data.length < this._max) {
            const freeObj = this._freeFunction(obj);
            this._data.push(freeObj);
            return true;
        }
        return false;
    };

    /**
     * 获取对象池的名称。
     */
    get name(): string {
        return this._name;
    }

    /**
     * 获取对象池的最大容量。
     */
    get max(): number {
        return this._max;
    }
}
