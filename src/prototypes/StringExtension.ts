// string 原型扩展类
export class StringExtension {

    static init() {
        // nothing
    }
}

declare global {
    interface String {
        // 转为 bytes 数组
        toUin8Array(): Uint8Array

        // 取整
        toInt(): number;

        // 转为数字
        toNumber(): number;
    }
}

// String 扩展函数：将字符串转换为 Uint8Array
String.prototype.toUin8Array = function (): Uint8Array {
    const str = this as string;
    const encoder = new TextEncoder();
    return encoder.encode(str);
};


String.prototype.toNumber = function (): number {
    try {
        return Number.parseFloat(this);
    } catch (e) {
        console.error(`文本转数字有问题 toNumber str=${this}`, e);
        return 0;
    }
}

String.prototype.toInt = function (): number {
    try {
        return Number.parseInt(this);
    } catch (e) {
        console.error(`文本转 int 有问题 toInt str=${this}`, e);
        return 0;
    }
}

