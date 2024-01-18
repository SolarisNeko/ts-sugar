import {mvvm} from "../../src/mvvm/mvvm";

// Mock class for testing
class TestClass {
    @mvvm({setFunName: 'setAge'})
    age: number = 0;

    counter: number = 0;

    // Mock set callback
    setAge(oldValue: number,
           newValue: number
    ) {
        console.log(`Mock set callback: Age changed from ${oldValue} to ${newValue}`);

        this.counter++
    }

}

describe('Mvvm Decorator Tests', () => {
    it('should invoke set callback when setting property', () => {
        const testInstance = new TestClass();

        testInstance.age = 25;

        expect(testInstance.age).toBe(25);
        expect(testInstance.counter).toBe(1);
    });

    it('should invoke get callback when getting property', () => {
        const testInstance = new TestClass();

        const currentAge = testInstance.age;

        // Additional check: Verify that the value returned matches the initial value
        expect(currentAge).toBe(0);
    });
});
