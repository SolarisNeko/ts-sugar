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

    it('Map 排序和转换', () => {
        const data = new Map<string, number>()
        data.set("1", 1)
        data.set("2", 2)
        const newList = Stream.fromMap(data)
            .map((x) => x.value)
            .sort((v) => v)
            .toList();
        expect(newList).toEqual([1, 2]);
    });

    // Add more test cases for other methods...
});
