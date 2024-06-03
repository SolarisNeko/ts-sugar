/**
 * 枚举工具
 * @author luohaojun
 *
 * 用途:
 * 1. 通过 value 反向获取 key Name, 因为后端通信用 value, 策划配置用 keyName, 如此割裂的情况下导致该工具诞生
 */
export class EnumUtils233 {


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
    static getEnumKeyNameByValue<T extends { [key: string]: any }>(
        enumObj: T,
        value: T[keyof T]
    ): string | undefined {

        return enumObj[value] as string;
    }

}