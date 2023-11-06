/**
 * 基类
 */
export default class AbstractSingleton {
    public constructor() {
    }

    /**
     * 获取一个单例
     * @returns {any}
     */
    public static getInstance<T>(...args: any[]): T {
        let self: any = this;

        // hack 一个字段
        if (!self._instance) {
            self._instance = new self(...args);
        }
        return self._instance;
    }
}