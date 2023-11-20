/**
 * 懒加载对象
 */
export class Lazy<T> {
    private factory: () => T;

    value?: T;

    constructor(factory: () => T) {
        this.factory = factory;
    }

    public get(): T {
        if (!this.value) {
            this.value = this.factory();
        }
        return this.value;
    }
}