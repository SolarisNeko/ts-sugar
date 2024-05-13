// string 原型扩展类
export class StringPrototypeExtension {

    static init() {
        // nothing
    }
}

declare global {
    interface String {
        // 转为 bytes 数组
        toUin8Array(): Uint8Array
    }
}

// String 扩展函数：将字符串转换为 Uint8Array
String.prototype.toUin8Array = function (): Uint8Array {
    const str = this as string;
    const encoder = new TextEncoder();
    return encoder.encode(str);
};


