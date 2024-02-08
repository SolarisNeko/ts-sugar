type ByteArray = Uint8Array;


export class ByteArrayData {
    private readIndex: number;
    private writeIndex: number;
    private data: ByteArray;
    private initSize: number;
    private maxSize: number | null;


    static create(initSize: number,
                  maxSize: number | null = null
    ): ByteArrayData {
        let byteArray = new Uint8Array(initSize);
        return new ByteArrayData(byteArray, 0, 0, maxSize);
    }

    constructor(data: ByteArray,
                readIndex: number,
                writeIndex: number,
                maxSize: number | null
    ) {
        this.data = data;
        this.initSize = data.length;
        this.readIndex = readIndex;
        this.writeIndex = writeIndex;
        this.maxSize = maxSize == null ? null : Math.max(maxSize, data.length);
    }


    writeBytes(startIndex: number,
               bytes: ByteArray
    ): ByteArrayData {
        if (this.maxSize === null) {
            if (1 + startIndex + bytes.length > this.data.length) {
                this.data = new Uint8Array([...this.data, ...new Uint8Array(bytes)]);
            }
            this.data.set(bytes, startIndex);
            this.writeIndex += bytes.length;
            return this;
        }

        if (1 + startIndex + bytes.length > this.maxSize) {
            this.data = new Uint8Array([...this.data, ...new Uint8Array(bytes)]);
        }
        this.data.set(bytes, startIndex);
        this.writeIndex += bytes.length;
        return this;
    }

    readBytes(startIndex: number,
              endIndex: number,
              isUpdateReadIndex: boolean
    ): ByteArray {
        const outBytes = this.data.slice(startIndex, endIndex);
        if (!isUpdateReadIndex) {
            return outBytes;
        }
        this.readIndex = Math.min(endIndex, this.writeIndex);
        return outBytes;
    }

    getCanReadSize(): number {
        return this.writeIndex - this.readIndex;
    }

    getCanWriteSize(): number {
        return this.data.length - 1 - this.writeIndex;
    }

    getReadIndex(): number {
        return this.readIndex;
    }

    getWriteIndex(): number {
        return this.writeIndex;
    }

    setReadWriteIndex(newReadIndex: number,
                      newWriteIndex: number
    ): ByteArrayData {
        this.readIndex = Math.max(0, newReadIndex);
        if (this.maxSize === null) {
            this.writeIndex = Math.min(newWriteIndex, this.data.length - 1);
            return this;
        }

        if (newWriteIndex > this.maxSize) {
            throw new Error(`Setting writeIndex beyond maxSize: ${newWriteIndex}, ${this.maxSize}`);
        }

        this.writeIndex = newWriteIndex;
        return this;
    }

    readTo(out: ByteArray): ByteArrayData {
        if (out === null) {
            return this;
        }
        const canReadSize = Math.min(out.length, this.getCanReadSize());
        out.set(this.data.subarray(this.readIndex, this.readIndex + canReadSize));
        this.readIndex += canReadSize;
        return this; // 返回 ByteArrayData 接口
    }

    readFrom(out: ByteArray): ByteArrayData {
        if (out === null) {
            return this;
        }
        const canReadSize = Math.min(out.length, this.getCanReadSize());
        out.set(this.data.subarray(this.readIndex, this.readIndex + canReadSize));
        return this; // 返回 ByteArrayData 接口
    }

    compact(): ByteArrayData {
        const newLength = this.writeIndex - this.readIndex ;

        if (newLength <= 0) {
            this.data = new Uint8Array(0); // 设置为空的 Uint8Array
            this.readIndex = 0;
            this.writeIndex = 0;
            return this;
        }

        // subarray 需要 (includeIndex, excludeIndex)
        const newBytes = new Uint8Array(this.data.subarray(this.readIndex, this.writeIndex + 1));
        this.data = newBytes;
        this.writeIndex = newBytes.length - 1;
        this.readIndex = 0;
        return this;
    }

    getByteArray(): ByteArray {
        return this.data;
    }

    getByteArrayCopy(): ByteArray {
        return new Uint8Array(this.data);
    }

    getSubByteArray(startIndex: number,
                    endIndex: number
    ): ByteArray {
        return this.data.subarray(startIndex, endIndex);
    }
}
