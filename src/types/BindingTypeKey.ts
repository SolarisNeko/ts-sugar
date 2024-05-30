import {Clazz} from "./Types";

/**
 * 强类型绑定 key
 */
export class BindingTypeKey<T> {

    // Key
    readonly key: string;

    // 绑定的 Class
    readonly clazz: Clazz<T>

    private constructor(key: string, clazz: Clazz<T>) {
        this.key = key;
        this.clazz = clazz;
    }

    /**
     * 创建 UI 绑定 Key
     * @param key
     * @param clazz
     */
    static create<T>(key: string, clazz: Clazz<T>): BindingTypeKey<T> {
        if (key == null || key.trim() == "") {
            console.error("key 不允许为 null.")
            return null;
        }
        if (clazz == null) {
            console.error("clazz 不允许为 null.")
            return null;
        }

        return new BindingTypeKey<T>(key, clazz);
    }
}