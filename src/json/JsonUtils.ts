import {Clazz} from "../types/Types";

;

export class JsonUtils {
    /**
     * 序列化
     * @param obj
     */
    static serialize<T>(obj: T): string {
        return JSON.stringify(obj);
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
                            JsonUtils.deserialize(JSON.stringify(item), (instance[key] && Object.getPrototypeOf(instance[key]).constructor) || Object)
                        );
                    } else {
                        // Recursively deserialize nested objects
                        instance[key] = JsonUtils.deserialize(JSON.stringify(value), (instance[key] && Object.getPrototypeOf(instance[key]).constructor) || Object);
                    }
                } else {
                    instance[key] = value;
                }
            }
        }

        return instance;
    }


}