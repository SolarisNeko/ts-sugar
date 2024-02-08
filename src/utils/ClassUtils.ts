/**
 * 类检查工具
 */
export class ClassUtils {


    /**
     * Checks if the given object is an array.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is an array, false otherwise.
     */
    static isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     * Checks if the given object is an object.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is an object, false otherwise.
     */
    static isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    /**
     * Checks if the given object is a string.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is a string, false otherwise.
     */
    static isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    /**
     * Checks if the given object is a number.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is a number, false otherwise.
     */
    static isNumber(obj) {
        return Object.prototype.toString.call(obj) === '[object Number]';
    }

    /**
     * Checks if the given object is a boolean.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is a boolean, false otherwise.
     */
    static isBoolean(obj) {
        return Object.prototype.toString.call(obj) === '[object Boolean]';
    }

    /**
     * Checks if the given object is a function.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is a function, false otherwise.
     */
    static isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }

    /**
     * Checks if the given object is an date.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is an date, false otherwise.
     */
    static isDate(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    /**
     * Checks if the given object is an error.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is an error, false otherwise.
     */
    static isError(obj) {
        return Object.prototype.toString.call(obj) === '[object Error]';
    }


}