/**
 * 克隆工具
 */
export class CloneUtils233 {

    // 存储类到数据 ID 映射的 Map
    private _classToDataIdMap: Map<Function, Map<number | string, any>> = new Map();

    /**
     * 递归深拷贝对象、数组和 Map
     * @param source
     */
    /**
     * 递归深拷贝对象、数组、Map、Set 和 Iterable
     * @param source 源数据
     */
    public static deepCopy<T>(source: T): T | null {
        if (source == null) {
            return null;
        }
        if (Array.isArray(source)) {
            // Array
            return source.map(item => CloneUtils233.deepCopy(item)) as unknown as T;
        } else if (source instanceof Map) {
            // Map
            const mapCopy = new Map();
            source.forEach((value, key) => {
                mapCopy.set(key, CloneUtils233.deepCopy(value));
            });
            return mapCopy as unknown as T;
        } else if (source instanceof Set) {
            // Set
            const setCopy = new Set();
            source.forEach(value => {
                setCopy.add(CloneUtils233.deepCopy(value));
            });
            return setCopy as unknown as T;
        } else if (source && typeof source[Symbol.iterator] === 'function' && typeof source !== 'string') {
            // Iterable (excluding string)
            const arrayCopy = [];
            // @ts-ignore
            for (const item of source) {
                arrayCopy.push(CloneUtils233.deepCopy(item));
            }
            return arrayCopy as unknown as T;
        } else if (source instanceof Object) {
            // Object
            const objectCopy: any = {};
            Object.keys(source).forEach(key => {
                objectCopy[key] = CloneUtils233.deepCopy((source as any)[key]);
            });
            return objectCopy;
        } else {
            // 基础类型
            // Primitive types (string, number, boolean, null, undefined)
            return source;
        }
    }


    /**
     * 递归地冻结对象、数组和 Map
     * @param obj
     */
    public static deepFreeze<T>(obj: T): T {
        if (Array.isArray(obj)) {
            obj.forEach(item => CloneUtils233.deepFreeze(item));
        } else if (obj instanceof Map) {
            obj.forEach((value, key) => {
                CloneUtils233.deepFreeze(value);
            });
        } else if (obj instanceof Object) {
            Object.keys(obj).forEach(key => {
                CloneUtils233.deepFreeze((obj as any)[key]);
            });
            Object.freeze(obj);
        }
        return obj;
    }
}