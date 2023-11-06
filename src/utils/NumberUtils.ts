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

}