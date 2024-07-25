// 在全局范围扩展 Uint8Array 类型
declare global {
    interface Uint8Array {
        toUtf8String(): string;

        // 转为操作实例
        toUInt8ArrayExtension(): UInt8ArrayExtension;
    }
}

// Uint8Array 原型扩展函数：获取 Uint8ArrayExtension 实例
Uint8Array.prototype.toUInt8ArrayExtension = function (): UInt8ArrayExtension {
    return new UInt8ArrayExtension(this);
};


// Uint8Array 扩展函数：将 Uint8Array 转换为字符串
Uint8Array.prototype.toUtf8String = function (): string {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(this);
};


// UInt8Array 扩展操作器
export class UInt8ArrayExtension {
    // bytes
    private uint8Array: Uint8Array;
    // 读索引
    private readIndex: number;
    // 写索引
    private writeIndex: number;

    constructor(uint8Array: Uint8Array) {
        this.uint8Array = uint8Array;
        this.readIndex = 0;
        this.writeIndex = this.findLastNonZeroIndex()
    }

    static init() {
        // nothing to do
    }

    public findLastNonZeroIndex(): number {
        for (let i = this.uint8Array.length - 1; i >= 0; i--) {
            if (this.uint8Array[i] !== 0) {
                return i;
            }
        }
        // 如果没有非零字节，则返回首个 index = 0
        return 0;
    }

    // 重置读写索引
    resetAllIndex(): void {
        this.readIndex = 0;
        this.writeIndex = 0;
    }

    // 读取一个字节
    readByte(): number {
        const byte = this.uint8Array[this.readIndex];
        this.readIndex += 1;
        return byte;
    }

    // 读取一个字节
    readBytes(length: number): Uint8Array {
        let uint8Array = this.uint8Array.subarray(this.readIndex, this.readIndex + length);
        this.readIndex += length;
        return uint8Array;
    }

    // 读取一个整数
    readInt(): number {
        const view = new DataView(this.uint8Array.buffer, this.readIndex, 4);
        const number = view.getInt32(this.readIndex);
        this.readIndex += 4;
        return number;
    }


    readShort() {
        const view = new DataView(this.uint8Array.buffer, this.readIndex, 2);
        const number = view.getInt16(0);
        this.readIndex += 2;
        return number;
    }

    readFloat() {
        const view = new DataView(this.uint8Array.buffer, this.readIndex, 4);
        const number = view.getFloat32(0);
        this.readIndex += 4;
        return number;
    }

    readDouble() {
        const view = new DataView(this.uint8Array.buffer, this.readIndex, 8);
        const number = view.getFloat64(0);
        this.readIndex += 8;
        return number;
    }

    // 读取一个布尔值
    readBoolean(): boolean {
        const byte = this.readByte();
        return byte !== 0;
    }

    // 添加一个整数到 Uint8Array
    addInt(number: number): UInt8ArrayExtension {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setInt32(0, number);
        const intArray = new Uint8Array(buffer);

        this.extendArrayIfNeeded(intArray.length);

        this.uint8Array.set(intArray, this.writeIndex);
        this.writeIndex += intArray.length;
        return this;
    }

    // 添加一个浮点数到 Uint8Array
    addFloat(number: number): UInt8ArrayExtension {
        const buffer = new ArrayBuffer(4);
        const view = new DataView(buffer);
        view.setFloat32(0, number);
        const floatArray = new Uint8Array(buffer);

        this.extendArrayIfNeeded(floatArray.length);

        this.uint8Array.set(floatArray, this.writeIndex);
        this.writeIndex += floatArray.length;
        return this;
    }

    // 添加一个双精度浮点数到 Uint8Array
    addDouble(number: number): UInt8ArrayExtension {
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setFloat64(0, number);
        const doubleArray = new Uint8Array(buffer);

        this.extendArrayIfNeeded(doubleArray.length);

        this.uint8Array.set(doubleArray, this.writeIndex);
        this.writeIndex += doubleArray.length;
        return this;
    }

    // 添加一个短整数到 Uint8Array
    addShort(number: number): UInt8ArrayExtension {
        const buffer = new ArrayBuffer(2);
        const view = new DataView(buffer);
        view.setInt16(0, number);
        const shortArray = new Uint8Array(buffer);

        this.extendArrayIfNeeded(shortArray.length);

        this.uint8Array.set(shortArray, this.writeIndex);
        this.writeIndex += shortArray.length;
        return this;
    }

    // 添加一个布尔值到 Uint8Array
    addBoolean(value: boolean): UInt8ArrayExtension {
        this.uint8Array[this.writeIndex] = value ? 1 : 0;
        this.writeIndex += 1;
        return this;
    }

    // 添加一个字符串到 Uint8Array
    addString(content: string): UInt8ArrayExtension {
        const strArray = new TextEncoder().encode(content);

        this.extendArrayIfNeeded(strArray.length);

        this.uint8Array.set(strArray, this.writeIndex);
        this.writeIndex += strArray.length;
        return this;
    }

    // 检查并扩展数组大小
    private extendArrayIfNeeded(dataLength: number): void {
        const newLength = this.writeIndex + dataLength;
        if (newLength > this.uint8Array.length) {
            const newArray = new Uint8Array(newLength);
            newArray.set(this.uint8Array.subarray(0, this.writeIndex), 0);
            this.uint8Array = newArray;
        }
    }

    toUint8Array(): Uint8Array {
        return this.uint8Array.subarray(0, this.writeIndex);
    }


}
