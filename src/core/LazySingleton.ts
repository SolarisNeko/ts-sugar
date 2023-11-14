
/**
 * 懒加载, 业务对象, 和 cc.Component 无关.
 * 无状态, 提供一系列常用方法
 */
export default class LazySingleton {

    /**
     * 获取一个单例
     * @returns {any}
     */
    public static instance<T>(...args: any[]): T {
        let self: any = this;

        // hack 一个字段
        if (!self._singleton) {
            self._singleton = new self(...args);
        }

        // 初始化
        self._singleton.init();
        return self._singleton;
    }

    public init() {

    }

    public destroy() {

    }
}