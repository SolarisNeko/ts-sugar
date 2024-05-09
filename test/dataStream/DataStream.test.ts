import {DataStream} from "../../src/dataStream/DataStream";

describe('Stream', () => {
    it('should create a dataStream from an array', () => {
        const data = [1, 2, 3];
        const stream = DataStream.from(data);
        expect(stream.toList()).toEqual(data);
    });

    it('should create a dataStream from a Set', () => {
        const data = new Set([1, 2, 3]);
        const stream = DataStream.from(data);
        expect(stream.toList()).toEqual(Array.from(data));
    });

    it('should sort data in ascending order', () => {
        const data = [3, 1, 2];
        const stream = DataStream.from(data).sortByWeight();
        expect(stream.toList()).toEqual([1, 2, 3]);
    });

    it('should map data', () => {
        const data = [1, 2, 3];
        const stream = DataStream.from(data).map((x) => x * 2);
        expect(stream.toList()).toEqual([2, 4, 6]);
    });

    it('Map 排序和转换', () => {
        const data = new Map<string, number>()
        data.set("1", 1)
        data.set("2", 2)
        const newList = DataStream.fromMap(data)
            .map((x) => x.value)
            .sortByWeight((v) => v)
            .toList();
        expect(newList).toEqual([1, 2]);
    });

    // Add more test cases for other methods...
});
