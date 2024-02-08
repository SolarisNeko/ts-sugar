import {ByteArrayData} from "../../src/bytes/ByteArrayData";

describe('ByteArrayData', () => {
    let byteArray: ByteArrayData;

    beforeEach(() => {
        // 创建一个 ByteArrayData 实例以供测试
        byteArray = ByteArrayData.create(10);
    });

    it('should write bytes correctly', () => {
        const bytes = new Uint8Array([1, 2, 3]);
        byteArray.writeBytes(0, bytes);
        expect(byteArray.getWriteIndex()).toBe(3);
        expect(byteArray.getByteArray()).toEqual(new Uint8Array([1, 2, 3, 0, 0, 0, 0, 0, 0, 0]));
    });

    it('should read bytes correctly', () => {
        const bytes = new Uint8Array([1, 2, 3]);
        byteArray.writeBytes(0, bytes);
        const readBytes = byteArray.readBytes(0, 3, true);
        expect(readBytes).toEqual(bytes);
        expect(byteArray.getReadIndex()).toBe(3);
    });

    it('should set read/write indices correctly', () => {
        byteArray.setReadWriteIndex(2, 6);
        expect(byteArray.getReadIndex()).toBe(2);
        expect(byteArray.getWriteIndex()).toBe(6);
    });

    it('should compact ByteArrayData correctly', () => {
        const bytes = new Uint8Array([1, 2, 3, 4, 5]);
        byteArray.writeBytes(0, bytes);
        byteArray.setReadWriteIndex(1, 5);
        byteArray.compact();
        expect(byteArray.getByteArray()).toEqual(new Uint8Array([2, 3, 4, 5, 0]));
        expect(byteArray.getReadIndex()).toBe(0);
        expect(byteArray.getWriteIndex()).toBe(4);
    });

    it('should not compact if byteArray is empty', () => {
        byteArray.compact();
        expect(byteArray.getByteArray()).toEqual(new Uint8Array(0));
    });

    it('should create a ByteArrayData instance', () => {
        const newInstance = ByteArrayData.create(5);
        expect(newInstance.getByteArray()).toEqual(new Uint8Array([0, 0, 0, 0, 0]));
    });

    it('should get a subarray of ByteArrayData', () => {
        const bytes = new Uint8Array([1, 2, 3, 4, 5]);
        byteArray.writeBytes(0, bytes);
        const subArray = byteArray.getSubByteArray(1, 4);
        expect(subArray).toEqual(new Uint8Array([2, 3, 4]));
    });

    it('should return the same ByteArray instance as a copy', () => {
        const byteArrayCopy = byteArray.getByteArrayCopy();
        expect(byteArray.getByteArray()).toEqual(byteArrayCopy);
        expect(byteArray.getByteArray() === byteArrayCopy).toBe(false);
    });
});