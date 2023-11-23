import { RateLimiter, Debounce, Throttle } from "../../src/rateLimiter/RateLimiter";


let rateLimiter = new RateLimiter(1);





test('test-name', () => {
    expect(rateLimiter.isRequestAllowed(1)).toBe(true)
    expect(rateLimiter.isRequestAllowed(1)).toBe(false)
})


class MyClass {
    debouncedCounter = 0;
    throttledCounter = 0;

    @Debounce(200)
    debouncedMethod() {
        this.debouncedCounter++;
        // Your debounced method implementation
    }

    @Throttle(300)
    throttledMethod() {
        this.throttledCounter++;
        // Your throttled method implementation
    }
}

jest.useFakeTimers();

describe('Debounce and Throttle Annotations', () => {
    it('should debounce the method', () => {
        const myInstance = new MyClass();

        myInstance.debouncedMethod();

        // Fast-forward time
        jest.advanceTimersByTime(199);

        // Method should not be called yet
        expect(myInstance.debouncedCounter).toBe(0);

        // Fast-forward one more millisecond
        jest.advanceTimersByTime(1);

        // Method should be called now
        expect(myInstance.debouncedCounter).toBe(1);
    });

    it('should throttle the method', () => {
        const myInstance = new MyClass();

        myInstance.throttledMethod();

        // Fast-forward time
        jest.advanceTimersByTime(299);

        // Method should be called once
        expect(myInstance.throttledCounter).toBe(1);

        // Fast-forward one more millisecond
        jest.advanceTimersByTime(1);

        // Method should not be called again
        expect(myInstance.throttledCounter).toBe(1);
    });
});