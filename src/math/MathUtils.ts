export class MathUtils {

    /**
     * 是否在范围内
     * @param value 值
     * @param min 最小值
     * @param max 最大值
     * @param includeMin 是否包含最小的
     * @param includeMax 是否包含最大的
     */
    static isInRange(value: number, min: number, max: number, includeMin: boolean = true, includeMax: boolean = true): boolean {
        if (includeMin && includeMax) {
            return value >= min && value <= max;
        }

        if (includeMin) {
            return value >= min && value < max;
        }

        if (includeMax) {
            return value > min && value <= max;
        }

        if (value < min) {
            return false;
        } else {
            return value < max;
        }
    }

}