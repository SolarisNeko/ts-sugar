export class Enums {
    /**
     * 通过字符串获取枚举类型
     * @param str 字符串
     * @param enumType 枚举类型
     * @returns 枚举类型，如果字符串无效则返回 null
     */
    static getTypeByName<T>(str: string, enumType: any): T | null {
        for (const key in enumType) {
            if (Object.prototype.hasOwnProperty.call(enumType, key)) {
                const value = enumType[key];
                if (typeof value === 'string' && value === str) {
                    return value as unknown as T;
                }
            }
        }
        return null;
    }
}
