/**
 * ObjectUtils is a collection of utility methods for dealing with objects.
 * Like Java Apache commons-lang3 / ObjectUtils
 *
 * @author LuoHaoJun
 * @version 1.0.0
 */
export default class ObjectUtils {

    /**
     * Checks if the given object is null or undefined.
     *
     * @param {Object} obj The object to check.
     * @returns {boolean} True if the object is null or undefined, false otherwise.
     */
    static isNullOrUndefined(obj) {
        return obj === null || typeof obj === 'undefined';
    }

    /**
     * 非空
     * @param obj
     */
    static isNotNullOrUndefined(obj) {
        return !this.isNullOrUndefined(obj);
    }

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