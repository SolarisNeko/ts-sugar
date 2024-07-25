import {UInt8ArrayExtension} from "../../src/prototypes/UInt8ArrayExtension";

describe('UInt8ArrayOperator', () => {
    it('should add and read int correctly', () => {
        const uint8Array = new Uint8Array(10);
        const operator = new UInt8ArrayExtension(uint8Array);

        operator.addInt(123);
        let read = operator.readInt();
        expect(read).toBe(123);
    });

    it('should add and read float correctly', () => {
        const uint8Array = new Uint8Array(10);
        const operator = new UInt8ArrayExtension(uint8Array);

        operator.addFloat(123.45);
        let read = operator.readFloat();
        expect(read).toBeCloseTo(123.45);
    });

    it('should add and read double correctly', () => {
        const uint8Array = new Uint8Array(20); // 8 bytes for double
        const operator = new UInt8ArrayExtension(uint8Array);

        operator.addDouble(123.456);
        let read = operator.readDouble();
        expect(read).toBeCloseTo(123.456);
    });

    it('should add and read short correctly', () => {
        const uint8Array = new Uint8Array(10);
        const operator = new UInt8ArrayExtension(uint8Array);

        operator.addShort(123);
        operator.addShort(456);
        let read1 = operator.readShort();
        let read2 = operator.readShort();
        expect(read1).toBe(123);
        expect(read2).toBe(456);
    });

    it('should add and read boolean correctly', () => {
        const uint8Array = new Uint8Array(10);
        const operator = new UInt8ArrayExtension(uint8Array);

        operator.addBoolean(true);
        operator.addBoolean(false);
        let read1 = operator.readBoolean();
        let read2 = operator.readBoolean();
        expect(read1).toBe(true);
        expect(read2).toBe(false);
    });


});
