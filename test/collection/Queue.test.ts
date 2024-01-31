import {Queue} from "../../src/collection/Queue";

describe('Queue', () => {
    let queue: Queue<number>;

    beforeEach(() => {
        queue = new Queue<number>();
    });

    test('enqueue and dequeue should add and remove elements correctly', () => {
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);

        expect(queue.size).toBe(3);

        expect(queue.dequeue()).toBe(1);
        expect(queue.dequeue()).toBe(2);
        expect(queue.dequeue()).toBe(3);
        expect(queue.size).toBe(0);
        expect(queue.dequeue()).toBeNull(); // Dequeue from an empty queue should return null
    });

    test('front and pop should return elements from the front and back correctly', () => {
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);

        expect(queue.front()).toBe(1);
        expect(queue.pop()).toBe(3);
        expect(queue.size).toBe(2);
        expect(queue.front()).toBe(1);
        expect(queue.pop()).toBe(2);
        expect(queue.size).toBe(1);
        expect(queue.pop()).toBe(1); // Pop from an empty queue should return null
    });

    test('clear should empty the queue', () => {
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);

        expect(queue.size).toBe(3);

        queue.clear();

        expect(queue.size).toBe(0);
        expect(queue.isEmpty()).toBe(true);
    });

    test('toString should return a string representation of the queue', () => {
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(3);

        expect(queue.toString()).toBe('1,2,3');
    });

    // Add more tests for other methods and edge cases as needed
});
