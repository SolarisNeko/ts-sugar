import {Clazz} from "../types/Types";

export class IAppUtils {
    /**
     * 检查是否实现了指定接口的类型守卫
     * @param instance 要检查的实例
     * @param apiArray 要检查的接口列表
     */
    static isImplInterface<T>(instance: any,
                              ...apiArray: T[]
    ): instance is T {
        return apiArray.every(inter => {
            Object.keys(inter).every(key => {
                return key in instance
            })
        });
    }


    /**
     * 获取 Class Type
     * @param obj 对象
     */
    static getObjectClass<T>(obj: T): Clazz<T> {
        return obj.constructor as Clazz<T>;
    }
}