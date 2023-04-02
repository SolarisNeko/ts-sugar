
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