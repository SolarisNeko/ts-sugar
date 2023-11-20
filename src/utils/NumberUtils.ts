import ObjectUtils from "./ObjectUtils";

/**
 * @author LuoHaoJun on 2023-06-20
 */
export default class NumberUtils {

    static parseInt(num: number,
        defaultValue: number = 0): number {
        if (ObjectUtils.isNullOrUndefined(num)) {
            return defaultValue;
        }
        return parseInt(num.toString());
    }

    static parseFloat(num: number,
        defaultValue: number = 0): number {
        if (ObjectUtils.isNullOrUndefined(num)) {
            return defaultValue;
        }
        return parseFloat(num.toString());
    }

    /**
     * digit = 用于表示数字的[单个数字]符号 0-9
     * @param value 数字
     * @returns 数字的位数 
     */
    static countDigits(value: number): number {
        return String(value).length;
    }

}