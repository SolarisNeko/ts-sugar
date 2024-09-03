import {Clazz} from "../types/Types";

/**
 * 抽象单例
 */
export class AbstractSingleton {

    /**
     * 单例
     * lazy singleton
     *
     * @return self
     */
    static ins<T extends any>(this: Clazz<T>): T {
        if (!(<any>this)._instance) {
            (<any>this)._instance = new this();
            (<any>this)._instance.onInit();
        }
        return (<any>this)._instance;
    }

    /**
     * 一般用不到, 调用需谨慎
     */
    static destroy(): void {
        if ((<any>this)._instance) {
            (<any>this)._instance.onDestroy();
            (<any>this)._instance = null;
        }
    }

    protected onInit(): void {
        // 子类实现
    };

    protected onDestroy(): void {
        // 子类实现
    };

    /**
     * 主动初始化
     */
    public init(): void {

    }
}