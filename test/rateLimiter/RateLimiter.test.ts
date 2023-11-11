import RateLimiter from "../../src/rateLimiter/RateLimiter";


let rateLimiter = new RateLimiter(1);



test('test-name', () => {
    expect(rateLimiter.isRequestAllowed(1)).toBe(true)
    expect(rateLimiter.isRequestAllowed(1)).toBe(false)
})

