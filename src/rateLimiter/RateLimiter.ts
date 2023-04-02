// RateLimiter.ts

import { RateLimiterApi } from "../../types/Suger";


// Rate limiter class for rate limiting requests
export class RateLimiter implements RateLimiterApi {

    // Maximum allowed requests per time window
    private readonly maxRequestsCount: number;

    // Time window in milliseconds
    private readonly timeWindowInMs: number;

    // Track the time window start
    private timeWindowStart: number;

    // Track the current number of requests
    private currentRequestsCount: number;


    constructor(maxRequestsCount: number, timeWindowInMs?: number) {
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

export default {RateLimiter}