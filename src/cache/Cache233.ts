/**
 * 缓存
 */
export class Cache233 {
    // 缓存对象，使用二级 Map
    private static _keyToArgStrToValueObj: Map<string, Map<string, any>> = new Map();

    /**
     * 缓存注解
     * @CacheValue("yourKey")
     * @param cacheKey
     * @constructor
     */
    static CacheValue(cacheKey: string) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value;

            descriptor.value = function (...args: any[]) {
                // 使用参数生成唯一的缓存键
                const argKey = JSON.stringify(args);
                // 直接使用 cacheKey 作为主键
                const fullCacheKey = cacheKey; 

                // 检查是否存在内层 Map
                if (!Cache233._keyToArgStrToValueObj.has(fullCacheKey)) {
                    Cache233._keyToArgStrToValueObj.set(fullCacheKey, new Map());
                }

                const argToValueMap = Cache233._keyToArgStrToValueObj.get(fullCacheKey)!;

                // 检查缓存中是否已有值
                if (argToValueMap.has(argKey)) {
                    // 返回缓存值
                    return argToValueMap.get(argKey);
                }

                // [func] 调用原始方法
                const result = originalMethod.apply(this, args);
                // 存储缓存值
                argToValueMap.set(argKey, result);
                return result;
            };
        };
    }

    /**
     * 添加缓存值
     * @param cacheKey
     * @param args
     * @param value
     */
    static add(cacheKey: string, args: any[], value: any): void {
        const argKey = JSON.stringify(args);

        if (!Cache233._keyToArgStrToValueObj.has(cacheKey)) {
            Cache233._keyToArgStrToValueObj.set(cacheKey, new Map());
        }

        const argToValueMap = Cache233._keyToArgStrToValueObj.get(cacheKey)!;
        argToValueMap.set(argKey, value);
    }

    /**
     * 获取缓存值
     * @param cacheKey
     * @param args
     * @returns
     */
    static get(cacheKey: string, args: any[]): any {
        const argKey = JSON.stringify(args);
        const argToValueMap = Cache233._keyToArgStrToValueObj.get(cacheKey);

        if (argToValueMap && argToValueMap.has(argKey)) {
            return argToValueMap.get(argKey);
        }

        return undefined; // 如果没有找到，返回 undefined
    }

    /**
     * 删除缓存
     * @param cacheKey
     * @param args
     */
    static remove(cacheKey: string, args: any[]): void {
        const argKey = JSON.stringify(args);
        const argToValueMap = Cache233._keyToArgStrToValueObj.get(cacheKey);

        if (argToValueMap) {
            argToValueMap.delete(argKey); // 删除特定参数组合的缓存
            if (argToValueMap.size === 0) {
                Cache233._keyToArgStrToValueObj.delete(cacheKey); // 如果没有缓存则删除外层 Map 的键
            }
        }
    }
}
