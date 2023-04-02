import Suger from '../../src/Suger.index'


let rateLimiter = new Suger.RateLimiter(1);



test('test-name', () => {
    expect(rateLimiter.isRequestAllowed(1)).toBe(true)
    expect(rateLimiter.isRequestAllowed(1)).toBe(false)
})

