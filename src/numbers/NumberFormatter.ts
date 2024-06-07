export enum EnumNumberFormatType {
    CN = 'CN',
    EN = 'EN',
}

/**
 * 数字格式化工具
 */
export class NumberFormatter {

    /**
     * 格式化数字 by 语言类型
     * @param count 数量
     * @param languageType
     */
    static formatNumberByLanguageType(count: number,
                               languageType: EnumNumberFormatType = EnumNumberFormatType.CN
    ): string {
        // 10w 内都直接处理
        if (count < 100000) {
            return count.toString();
        }

        const unitsCN = ['万', '亿'];
        const unitsEN = ['K', 'M'];
        let unit = '';
        let value = 0;

        if (languageType === EnumNumberFormatType.CN) {
            // 中文
            if (count < 100000000) {
                value = count / 10000;
                unit = unitsCN[0]; // 万
            } else {
                value = count / 100000000;
                unit = unitsCN[1]; // 亿
            }
        } else {
            // 英文
            if (count < 1000000) {
                value = count / 1000;
                unit = unitsEN[0]; // K
            } else {
                value = count / 1000000;
                unit = unitsEN[1]; // M
            }
        }

        let formattedValue = value.toFixed(3).replace(/\.?0+$/, '');
        return formattedValue + unit;
    }
}