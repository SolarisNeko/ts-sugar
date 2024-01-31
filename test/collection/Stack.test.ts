import {Stack} from "../../src/collection/Stack";

describe('Stack', () => {
    let stack: Stack<number>;

    beforeEach(() => {
        stack = new Stack<number>();
    });

    test('push and pop should add and remove elements correctly', () => {
        stack.push(1);
        stack.push(2);
        stack.push(3);

        expect(stack.size()).toBe(3);

        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);
        expect(stack.size()).toBe(0);
        expect(stack.pop()).toBeNull(); // Pop from an empty stack should return null
    });

    test('peek should return the top element without removing it', () => {
        stack.push(1);
        stack.push(2);
        stack.push(3);

        expect(stack.peek()).toBe(3);
        expect(stack.size()).toBe(3);

        expect(stack.peek()).toBe(3); // Peek should not remove the element
        expect(stack.size()).toBe(3);
    });

    test('isEmpty should correctly identify an empty stack', () => {
        expect(stack.isEmpty()).toBe(true);

        stack.push(1);

        expect(stack.isEmpty()).toBe(false);

        stack.pop();

        expect(stack.isEmpty()).toBe(true);
    });

    test('clear should empty the stack', () => {
        stack.push(1);
        stack.push(2);
        stack.push(3);

        expect(stack.size()).toBe(3);

        stack.clear();

        expect(stack.size()).toBe(0);
        expect(stack.isEmpty()).toBe(true);
    });

    test('forEach should iterate over each element in the stack', () => {
        const elements: number[] = [];
        stack.push(1);
        stack.push(2);
        stack.push(3);

        stack.forEach((item) => {
            elements.push(item);
        });

        expect(elements).toEqual([1, 2, 3]);
    });

    // Add more tests for other methods and edge cases as needed
});
