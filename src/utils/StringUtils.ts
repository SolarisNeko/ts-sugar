/**
 * Like Java Apache StringUtils
 *
 * @author LuoHaoJun
 * @version 1.0.0
 */
export class StringUtils {

    // 判断字符串是否为空
    static isEmpty(str) {
        return str === null || str === undefined || str.length === 0;
    }

    // 判断字符串是否不为空
    static isNotEmpty(str: any) {
        return !StringUtils.isEmpty(str);
    }

    // 去除字符串两端空格
    static trim(str) {
        if (this.isBlank(str)) {
            return "";
        }
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    // 判断字符串是否为数字
    static isNumeric(str) {
        const reg = /^[0-9]+.?[0-9]*$/;
        return reg.test(str);
    }

    // 判断字符串是否为空白
    static isBlank(str) {
        if (str == null) {
            return true;
        }
        const reg = /\s/;
        return reg.test(str);
    }

    // 判断字符串是否不为空白
    static isNotBlank(str) {
        return !StringUtils.isBlank(str);
    }
}