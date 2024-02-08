import {Clazz} from "../types/Types";

/**
 * ObjectUtils is a collection of utility methods for dealing with objects.
 * Like Java Apache commons-lang3 / ObjectUtils
 *
 * @author LuoHaoJun
 * @version 1.0.0
 */
export class ObjectUtils {

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


    /**
     * 递归拷贝属性
     * @param source 来源对象
     * @param target 目标对象
     */
    public static copyProperty(source: any, target: any): void {
        if (!source || !target) {
            return;
        }

        for (const key in source) {
            // 不包含原型链
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    // 如果属性值是对象且不为null，递归复制
                    target[key] = target[key] || {};
                    this.copyProperty(source[key], target[key]);
                } else {
                    // 否则直接复制属性值
                    target[key] = source[key];
                }
            }
        }
    }

    static initObj<T>(obj: T, init: (obj: T) => void): T {
        init(obj);
        return obj;
    }

    static initObjByClass<T>(clazz: Clazz<T>, init: (obj: T) => void): T {
        let obj: T = new clazz();
        init(obj);
        return obj;
    }

    static cloneDataObject<T>(item: T): T {
        return JSON.parse(JSON.stringify(item));
    }
}