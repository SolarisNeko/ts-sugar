// RateLimiter.ts
// Rate limiter class for rate limiting requests
export class RateLimiter {
    constructor(maxRequestsCount, timeWindowInMs) {
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
    isRequestAllowed(requestTime) {
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
    isRequestNotAllowed(requestTime) {
        return !this.isRequestAllowed(requestTime);
    }
}
export default { RateLimiter };
