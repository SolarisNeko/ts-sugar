import { Lazy } from "../../src/lazy/lazy";

describe('Lazy', () => {
    // Mock class for testing
    class MockClass {
        expensiveOperation() {
            return 'Result of expensive operation';
        }
    }

    it('should create an instance of Lazy and get the value', () => {
        const lazyInstance = new Lazy(() => new MockClass());

        // Call get() for the first time, it should create the instance
        const result1 = lazyInstance.get();
        expect(result1).toBeInstanceOf(MockClass);

        // Call get() for the second time, it should return the same instance
        const result2 = lazyInstance.get();
        expect(result2).toBe(result1);
    });

    it('should lazily create the value', () => {
        const factoryMock = jest.fn(() => new MockClass());
        const lazyInstance = new Lazy(factoryMock);

        // Call get() multiple times
        lazyInstance.get();
        lazyInstance.get();
        lazyInstance.get();

        // The factory function should only be called once
        expect(factoryMock).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined value from factory', () => {
        const lazyInstance = new Lazy(() => undefined);

        // Call get() multiple times
        const result1 = lazyInstance.get();
        const result2 = lazyInstance.get();
        const result3 = lazyInstance.get();

        // All results should be undefined
        expect(result1).toBeUndefined();
        expect(result2).toBeUndefined();
        expect(result3).toBeUndefined();
    });
});
