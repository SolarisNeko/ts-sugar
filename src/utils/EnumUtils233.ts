/**
 * 枚举工具
 * @author luohaojun
 *
 * 用途:
 * 1. 通过 value 反向获取 key Name, 因为后端通信用 value, 策划配置用 keyName, 如此割裂的情况下导致该工具诞生
 */
export class EnumUtils233 {

// 存储枚举的反向映射表 <enumObj, Map<enumValue, enumKeyName>>
    private static _enumValueToKeyMap = new Map<object, Map<string | number, string>>();

    /**
     * 根据 enum value(后端通信用) 获取 enum keyName(策划配置用)
     * - 泛型约束
     *
     * @param enumObj 枚举对象
     * @param value 枚举值
     * @returns 枚举键名，如果找不到则返回 undefined
     *
     * @demo         const bigTalentName = EnumUtils.getEnumKeyNameByValue(ServerEnums.TalentType, ServerEnums.TalentType.ADVANCED);
     */
    static getEnumKeyNameByValue<T extends { [key: string]: string | number }>(
        enumObj: T,
        value: T[keyof T]
    ): string | null {
        if (!value) {
            return null;
        }

        // lazy init 反向 value to key map
        let enumValueToKeyMap = this._enumValueToKeyMap.get(enumObj);
        if (!enumValueToKeyMap) {
            // 如果反向映射表不存在，则构建一个
            enumValueToKeyMap = new Map<string | number, string>();
            for (const key in enumObj) {
                enumValueToKeyMap.set(enumObj[key], key);
            }
            this._enumValueToKeyMap.set(enumObj, enumValueToKeyMap);
        }

        // 直接从反向映射表中查找
        return enumValueToKeyMap.get(value) ?? null;
    }


    /**
     * 获取枚举的所有键名
     * @param enumObj 枚举对象
     * @returns 枚举键名数组
     */
    static getAllKeys<T extends { [key: string]: any }>(enumObj: T): (keyof T)[] {
        return Object.keys(enumObj)
            .map(key => key as keyof T); // 类型断言为 keyof T
    }

    /**
     * 获取枚举的所有值
     * @param enumObj 枚举对象
     * @returns 枚举值数组
     */
    static getAllValues<T extends { [key: string]: any }>(enumObj: T): T[keyof T][] {
        const keys = this.getAllKeys(enumObj);
        return keys.map(key => enumObj[key]);
    }

}