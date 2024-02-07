/**
 * 对象池
 */
export default class ObjectPool<T> {
    private pool: T[] = [];

    constructor(private createInstance: () => T,
                private cleanUp: (item: T) => void,
                private maxSize: number = 10) {
    }

    acquire(): T {
        if (this.pool.length > 0) {
            return this.pool.pop()!;
        } else {
            return this.createInstance();
        }
    }

    release(item: T): void {
        if (this.pool.length >= this.maxSize) {
            return
        }
        this.cleanUp(item);
        this.pool.push(item);
    }
}
