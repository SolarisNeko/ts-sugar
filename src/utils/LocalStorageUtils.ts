import {Clazz} from "../types/Types";
import {JsonUtils} from "../json/JsonUtils";
import {ObjectUtils} from "./ObjectUtils";

/**
 * 本地存储
 */
export class LocalStorageUtils {

    // 获取所有键值对的总大小
    static getTotalSize(): number {
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const value = localStorage.getItem(key);
                if (value) {
                    totalSize += this.getSizeInBytes0(key) + this.getSizeInBytes0(value);
                }
            }
        }
        return totalSize;
    }

    // 将字符串转换为字节大小
    private static getSizeInBytes0(str: string): number {
        return new Blob([str]).size;
    }

    // 添加数据到LocalStorage
    static setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    // 获取数据从LocalStorage
    static getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    // 删除数据从LocalStorage
    static removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    // 清空LocalStorage
    static clear(): void {
        localStorage.clear();
    }

    // 添加对象到LocalStorage
    static setObject<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // 获取对象从LocalStorage
    static getObject<T>(key: string, type: Clazz<T>): T | null {
        const value = localStorage.getItem(key);
        const obj = new type();
        if (!value) {
            return obj;
        }
        try {
            const parse = JSON.parse(value);
            return Object.assign(obj, parse);
        } catch (e) {
            console.error(`localstorage get object error. key=${key}, value=${value}, error=`, e)
            return obj;
        }
    }


    /**
     * 设置
     * @param key
     * @param value
     * @param errorCallback
     */
    static set(
        key: string,
        value: any,
        errorCallback: (error: Error) => void = null
    ) {
        if (localStorage) {
            if (value === null) {
                localStorage.removeItem(key);
                return;
            }
            try {
                if (ObjectUtils.isString(value)) {
                    localStorage.setItem(key, value);
                } else if (ObjectUtils.isNumber(value)) {
                    localStorage.setItem(key, value);
                } else {
                    const json = JsonUtils.serialize(value);
                    localStorage.setItem(key, json);

                }
            } catch (e) {
                if (errorCallback) {
                    errorCallback(e);
                }
            }
        } else {
            console.error(`localStorage not found. key = ${key}`)
        }
    }

    /**
     * 获取
     * @param key
     * @param clazz
     * @param defaultValueCreator
     */
    static get<T>(
        key: string,
        clazz: Clazz<T>,
        defaultValueCreator: () => T = null,
    ): T {
        if (localStorage) {
            try {
                let value: string = localStorage.getItem(key)?.toString();
                if (!value) {
                    if (defaultValueCreator) {
                        return defaultValueCreator();
                    }
                    return null;
                }

                const className = clazz?.name || "";
                // Boolean
                if (className === "Boolean") {
                    return (value === "true") as T;
                }
                // Number
                if (className == "Number") {
                    if (value.includes(".")) {
                        return Number.parseFloat(value) as T;
                    } else {
                        return Number.parseInt(value) as T;
                    }
                }
                // String
                if (className == "String") {
                    return value as T;
                }

                // 反序列化
                return JsonUtils.deserialize(value, clazz);
            } catch (error) {
                console.error(`localStorage get key error. key = ${key}`, error)
                if (defaultValueCreator) {
                    return defaultValueCreator();
                }
                return null;
            }
        } else {
            console.error(`localStorage not found. key = ${key}`)
        }
    }

    /**
     * 根据前缀名匹配 keys
     * @param prefixName
     */
    static getAllKeyPreLike(prefixName: string): string[] {
        const matchingKeys: string[] = [];

        // 遍历 LocalStorage 中的所有键
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefixName)) {
                matchingKeys.push(key);
            }
        }

        return matchingKeys;
    }


}
