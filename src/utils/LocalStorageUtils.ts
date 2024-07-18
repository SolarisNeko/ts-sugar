import {Clazz} from "../types/Types";

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
}
