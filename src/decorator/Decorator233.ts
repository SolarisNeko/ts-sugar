/**
 * 通用装饰器
 */
export class Decorator233 {

    /**
     * 防抖注解
     * 窗口时间内, 只执行最后一次函数, 调用延长 timeMs 执行
     * @param timeMs 防抖时间 ms
     */
    public static AntiShakeCallFunc(timeMs: number) {
        return function (target: any,
                         propKey: string,
                         descriptor: PropertyDescriptor
        ) {
            let oldFunc = descriptor.value
            let timer = null;

            descriptor.value = function (...args: any[]) {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    oldFunc.apply(this, args);
                }, timeMs);
            }
        }
    }

    /**
     * 限流注解
     *  * 窗口时间内, 只执行第一次函数, timeMs 后解锁
     * @param timeMs 限流时间 ms
     */
    public static LimitCallFuncPerTimeMs(timeMs: number) {
        return function (target: any,
                         propKey: string,
                         descriptor: PropertyDescriptor
        ) {
            let oldFunc = descriptor.value
            let isLock = false;

            descriptor.value = function (...args: any[]) {
                if (isLock) {
                    return
                }
                isLock = true
                oldFunc.apply(this, args);
                setTimeout(() => {
                    isLock = false

                }, timeMs);
            }
        }
    }

    /**
     * 缓存返回值注解
     * 缓存函数的返回值，下次调用时直接返回缓存值，直到缓存过期或被清除
     * @param expireMs 缓存过期时间，单位毫秒，默认永不过期
     */
    public static CacheReturnValue(expireMs: number = -1) {
        return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
            const cacheKey = Symbol(propKey); // 使用 Symbol 作为唯一的缓存键
            const oldFunc = descriptor.value;

            descriptor.value = function (...args: any[]) {
                // 检查缓存是否过期
                if (
                    this[cacheKey] &&
                    (expireMs === -1 || Date.now() - this[cacheKey].timestamp < expireMs)
                ) {
                    return this[cacheKey].value; // 返回缓存值
                }

                // 调用原始函数并缓存结果
                const result = oldFunc.apply(this, args);
                this[cacheKey] = {
                    value: result,
                    timestamp: Date.now(),
                };
                return result;
            };
        };
    }
}
