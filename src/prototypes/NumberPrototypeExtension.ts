export class NumberPrototypeExtension {
    static init(): void {
        // just import 
    }
}

// 全局扩展 Array 原型
declare global {
    interface Number {
        // 取整
        toInt(): number;
        
        // 向上取整
        toRoundUp(): number

        // 保留多少位小数 | 不足补 0
        withDecimalCount(decimalCount: number, addZeroToDecimal: boolean): number;
    }
}

Number.prototype.toInt = function (): number {
    return Math.floor(this);
}

Number.prototype.toRoundUp = function (): number {
    return Math.ceil(this);
}

Number.prototype.withDecimalCount = function (decimalCount: number, addZeroToDecimal: boolean = true): number {
    const numberString = this.toString();
    const decimalIndex = numberString.indexOf('.');

    // 如果是整数，添加小数点和指定数量的零
    if (decimalIndex === -1) {
        return parseFloat(numberString + '.' + '0'.repeat(decimalCount));
    }

    // 如果有小数部分，则补充零以达到指定的小数位数
    const currentDecimalCount = numberString.length - decimalIndex - 1;
    if (currentDecimalCount < decimalCount) {
        // 不足以补 0 
        if (addZeroToDecimal) {
            return parseFloat(numberString + '0'.repeat(decimalCount - currentDecimalCount));
        }
    }

    // 超过指定的小数位数，截取小数部分
    return parseFloat(numberString.substring(0, decimalIndex + decimalCount + 1));
};