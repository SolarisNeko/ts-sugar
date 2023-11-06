export default class RandomUtils {
    /**
     * 生成指定范围内的随机整数
     * @param min 最小值（包含）
     * @param max 最大值（包含）
     * @returns 随机整数
     */
    static generateRandomInteger(min: number,
                                 max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 生成指定长度的随机字符串（包含大写字母、小写字母和数字）
     * @param length 字符串长度
     * @returns 随机字符串
     */
    static generateRandomString(length: number): string {
        const characters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
}
