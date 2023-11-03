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
}