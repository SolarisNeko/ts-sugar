
/**
 * 限流相关
 */

/**
 * 防抖注解
 * 窗口时间内, 只执行最后一次函数, 调用延长 timeMs 执行
 * @param timeMs 防抖时间 ms 
 */
export function Debounce(timeMs: number) {
    return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
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
export function Throttle(timeMs: number) {
    return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
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


// Interface for rate limit.
export interface RateLimiterApi {

    // Check if the request is allowed
    isRequestAllowed(requestTime: number): boolean;

    /**
     * 是否不允许
     * @param requestTime 请求次数
     */
    isRequestNotAllowed(requestTime: number): boolean;
}

/**
 * 限流器, n 秒/m次
 * Rate limiter class for rate limiting requests
 */
export class RateLimiter implements RateLimiterApi {

    // Maximum allowed requests per time window
    private readonly maxRequestsCount: number;

    // Time window in milliseconds
    private readonly timeWindowInMs: number;

    // Track the time window start
    private timeWindowStart: number;

    // Track the current number of requests
    private currentRequestsCount: number;


    constructor(maxRequestsCount: number,
        timeWindowInMs?: number
    ) {
        this.maxRequestsCount = maxRequestsCount;
        // 永久
        this.timeWindowInMs = timeWindowInMs || Date.now() + 9999999999999;
        this.timeWindowStart = Date.now();
        this.currentRequestsCount = 0;
    }

    /**
     * 是否允许通过
     * @param requestTime 请求次数
     * @returns 是否允许
     */
    isRequestAllowed(requestTime: number): boolean {
        // Check if the time window has been exceeded
        if (requestTime - this.timeWindowStart > this.timeWindowInMs) {
            // Reset the window
            this.timeWindowStart = requestTime;
            this.currentRequestsCount = 0;

        }
        // Check if the maximum number of requests has been exceeded
        if (this.currentRequestsCount >= this.maxRequestsCount) {
            return false;
        }
        // Increment the number of requests
        this.currentRequestsCount++;
        return true;

    }

    /**
     * 是否不允许
     * @param requestTime 请求次数
     */
    isRequestNotAllowed(requestTime: number): boolean {
        return !this.isRequestAllowed(requestTime);
    }
}
