import {Stream} from "../../src/stream/Stream";

describe('Stream', () => {
    it('should create a stream from an array', () => {
        const data = [1, 2, 3];
        const stream = Stream.from(data);
        expect(stream.toList()).toEqual(data);
    });

    it('should create a stream from a Set', () => {
        const data = new Set([1, 2, 3]);
        const stream = Stream.from(data);
        expect(stream.toList()).toEqual(Array.from(data));
    });

    it('should create a stream from an object (Dictionary)', () => {
        const data = {a: 1, b: 2, c: 3};
        const stream = Stream.from(data);
        expect(stream.toList()).toEqual([1, 2, 3]);
    });

    it('should sort data in ascending order', () => {
        const data = [3, 1, 2];
        const stream = Stream.from(data).sort();
        expect(stream.toList()).toEqual([1, 2, 3]);
    });

    it('should map data', () => {
        const data = [1, 2, 3];
        const stream = Stream.from(data).map((x) => x * 2);
        expect(stream.toList()).toEqual([2, 4, 6]);
    });

    // Add more test cases for other methods...
});
