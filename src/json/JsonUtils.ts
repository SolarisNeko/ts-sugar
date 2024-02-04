import {Clazz} from "../types/Types";


export class JsonUtils {

// 自定义 replacer 函数, 用于打印私有变量 "_" 开头的部分, 以及避免循环引用
    static replacer = (key: string, value: any): any => {
        if (value instanceof Map) {
            // Convert Map to plain object for serialization
            const obj: any = {};
            value.forEach((v, k) => {
                obj[k] = v;
            });
            return obj
        }

        // 如果属性名以 '_' 开头，即私有属性，允许打印
        if (key.startsWith('_')) {
            return value;
        }

        // 如果是对象，递归调用 replacer
        if (typeof value === 'object' && value !== null) {
            const filteredValue: { [key: string]: any } = {};
            Object.keys(value).forEach(innerKey => {
                filteredValue[innerKey] = JsonUtils.replacer(innerKey, value[innerKey]);
            });
            return filteredValue;
        }

        return value;
    };

    /**
     * 序列化
     * @param obj
     * @param isThrow 是否抛出异常
     */
    static serialize<T>(obj: T,
                        isThrow: boolean = false,
    ): string {
        try {
            return JSON.stringify(obj, JsonUtils.replacer);
        } catch (e) {
            if (isThrow) {
                console.error("JSON 序列化失败, 大概率是循环引用了")
                throw e
            }
            return "{}"
        }
    }

    /**
     * 反序列化
     * @param json
     * @param type
     */
    static deserialize<T>(json: string, type: Clazz<T>): T {
        // will throw error
        const obj = JSON.parse(json);
        const instance = new type();

        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];

                if (typeof value === 'object' && value !== null) {
                    if (Array.isArray(value)) {
                        // Handle arrays by recursively deserializing each element
                        instance[key] = value.map((item: any) =>
                            JsonUtils.deserialize(JSON.stringify(item),
                                (instance[key] && Object.getPrototypeOf(instance[key]).constructor) || Object),
                        );
                    } else {
                        // Recursively deserialize nested objects
                        instance[key] = JsonUtils.deserialize(JSON.stringify(value),
                            (instance[key] && Object.getPrototypeOf(instance[key]).constructor) || Object);
                    }
                } else {
                    instance[key] = value;
                }
            }
        }

        return instance;
    }


}