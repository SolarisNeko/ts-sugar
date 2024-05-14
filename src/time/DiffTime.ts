import {DateTimeUtils} from "./DateTimeUtils";

export enum DiffTimeType {
    // 未来
    FUTURE = "future",
    // 过去
    PAST = "past",
}

/**
 * 过期时间
 */
export class DiffTime {
    // 距离过期时间是什么时候?
    readonly type: DiffTimeType = DiffTimeType.FUTURE;
    readonly atTimeMs: number = 0;
    readonly diffDays: number = 0;
    readonly diffHours: number = 0;
    readonly diffMinutes: number = 0;
    readonly diffSeconds: number = 0;
    readonly diffTimeMs: number = 0;

    static createByAtTimeMs(atTimeMs: number): DiffTime {
        const diffTimeMs = atTimeMs - Date.now();
        let type = DiffTimeType.PAST;
        if (diffTimeMs <= 0) {
        } else {
            type = DiffTimeType.FUTURE
        }
        return new DiffTime(type, Math.abs(diffTimeMs), atTimeMs);
    }

    /**
     * 过期时间
     * @param diffTimeMs 差距时间
     * @param type 方式
     * @param atTimeMs 时间戳点
     */
    private constructor(type: DiffTimeType, diffTimeMs: number, atTimeMs: number) {
        this.type = type;
        this.atTimeMs = atTimeMs;

        this.diffTimeMs = diffTimeMs;
        if (diffTimeMs <= 0) {
            return;
        }

        const seconds = Math.floor(diffTimeMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        this.diffDays = days;
        this.diffHours = hours % 24;
        this.diffMinutes = minutes % 60;
        this.diffSeconds = seconds % 60;
    }

    /**
     * 转为过期时间文本
     * @param maxUnitCount 最大单位数量
     */
    toMaxExpireTimeText(maxUnitCount: number = 2): string {
        let changeFlag = false;
        let text = "";
        let count = 0;

        if (this.diffDays > 0) {
            if (count < maxUnitCount) {
                text += `${this.diffDays}天`;
                changeFlag = true;
                count++;
            }
        }

        if (this.diffHours > 0) {
            if (count < maxUnitCount) {
                text += `${this.diffHours}小时`;
                changeFlag = true;
                count++;
            }
        }

        if (this.diffMinutes > 0) {
            if (count < maxUnitCount) {
                text += `${this.diffMinutes}分钟`;
                changeFlag = true;
                count++;
            }
        }

        if (this.diffSeconds > 0) {
            if (count < maxUnitCount) {
                text += `${this.diffSeconds}秒`;
                changeFlag = true;
                count++;
            }
        }

        if (!changeFlag) {
            return "已过期";
        }

        return text + "后过期";
    }

    /**
     * 转为过去时间文本 | 1 分钟前 -> 1 小时前 -> yyyy-MM-dd
     * @param maxUnitCount
     */
    toMaxPastTimeText(maxUnitCount: number = 2): string {
        let changeFlag = false;
        let text = "";
        let count = 0;

        if (this.diffDays > 0) {
            return DateTimeUtils.getDateTimeText(this.atTimeMs, "yyyy-MM-dd HH:mm")
        }

        if (this.diffHours > 0) {
            if (count < maxUnitCount) {
                text += `${this.diffHours}小时`;
                changeFlag = true;
                count++;
            }
        }

        if (this.diffMinutes > 0) {
            if (count < maxUnitCount) {
                text += `${this.diffMinutes}分钟`;
                changeFlag = true;
                count++;
            }
        }

        if (this.diffSeconds > 0) {
            if (count < maxUnitCount) {
                text += `${this.diffSeconds}秒`;
                changeFlag = true;
                count++;
            }
        }

        if (!changeFlag) {
            return "已过期";
        }

        return text + "前";
    }

}

