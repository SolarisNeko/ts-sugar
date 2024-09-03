import {StringUtils} from "../utils/StringUtils";

/**
 * 2023-10-25T13:30:00Z = UTC+0 timezone
 * 2023-10-25T13:30:00 = UTC+${当前时区} = UTC+8 default
 */
export class DateTimeUtils {

    //  时区：暂时按东八区，需要与服务器一致
    public static readonly TIME_ZONE: string = "+08";

    /**
     * 格式化时间点
     * @param timeMs 时间戳
     * @param format 格式字符串，例如 "yyyy-MM-dd HH:mm:ss"
     * @returns 格式化后的时间文本
     */
    public static getDateTimeText(timeMs: number, format: string = "yyyy-MM-dd HH:mm:ss"): string {
        const date: Date = new Date(timeMs);
        const year: number = date.getFullYear();
        const month: number = date.getMonth() + 1;  // 返回的月份从0-11；
        const day: number = date.getDate();
        const hours: number = date.getHours();
        const minute: number = date.getMinutes();
        const second: number = date.getSeconds();
        const ms: number = date.getMilliseconds();
        const msStr: string = StringUtils.padLeft(ms.toString(), 3, '0');

        const tokens = {
            'yyyy': year,
            'MM': month,
            'dd': day,
            'HH': hours,
            'mm': minute,
            'ss': second,
            'SSS': msStr, // 确保毫秒为三位数
        };
        return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, match => {
            const str: string = tokens[match].toString();
            return StringUtils.padLeft(str, 2, '0')
        });
    }

    /**
     * 获取当前日期文本
     * @param format 格式字符串，例如 "yyyy-MM-dd HH:mm:ss"
     * @returns 格式化后的当前日期文本
     */
    public static getCurrentDateTimeText(format: string = "yyyy-MM-dd HH:mm:ss,SSS"): string {
        const timeMs = new Date().getTime();
        return this.getDateTimeText(timeMs, format);
    }


    public static getTomorrowStartTime(time: number = this.currentTimeMs,
                                       offsetHour: number = 0,
    ): number {
        let date: Date = new Date(time);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
            offsetHour, 0, 0, 0,
        )
            .getTime() + 24 * 3600 * 1000;
    }

    public static getYesterdayStartTime(time: number = this.currentTimeMs,
                                        offsetHour: number = 0,
    ): number {
        let date: Date = new Date(time);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
            offsetHour, 0, 0, 0).getTime() - 24 * 3600 * 1000;
    }

    /**
     * 获取下次后端刷新数据时间点（自定义刷新时间）
     * 默认 0 点刷新
     */
    public static getRefreshDataTime(time: number = this.currentTimeMs,
                                     offsetHour: number = 0,
    ): number {
        let date = new Date(time);
        if (date.getHours() < offsetHour) {
            return new Date(date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                0,
                0,
                0,
                0).getTime() + offsetHour * 3600 * 1000;
        } else {
            return this.getTomorrowStartTime(time) + offsetHour * 3600 * 1000;
        }
    }

    /**
     * 获取上次后端刷新数据时间点（自定义刷新时间）
     * 默认 0 点刷新
     */
    public static getLastRefreshDateTimeByHour(time: number = this.currentTimeMs,
                                               offsetHour: number = 0,
    ): number {
        let date = new Date(time);
        if (date.getHours() < offsetHour) {
            return this.getYesterdayStartTime(time) + (24 + offsetHour % 24) * 3600 * 1000;
        } else {
            let dt: Date = new Date(date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                0,
                0,
                0,
                0);
            // hour to ms
            let addTimeMs: number = offsetHour * 3600 * 1000;
            return dt.getTime() + addTimeMs;
        }
    }


    public static getMonthBySecond(time: number): number {
        let date: Date = new Date(time);
        return date.getMonth() + 1;
    }

    /**
     * 客户端运行时间，仅用于防加速
     */
    public static get currentTimeMs(): number {
        return new Date().getTime();
    }

    /**
     * 当前时间戳
     */
    static getCurrentTimeMs(): number {
        return new Date().getTime()
    }

    /**
     * 当前时间戳
     */
    static nowString(): string {
        return this.getCurrentDateTimeText("yyyy-MM-dd HH:mm:ss,SSS");
    }

    static getValueByTimeUnit(atTimeMs: number,
                              timeUnit: TimeUnit
    ): number {
        let date: Date = new Date(atTimeMs);
        switch (timeUnit) {
            case TimeUnit.DAYS:
                return date.getDate();
            case TimeUnit.HOURS:
                return date.getHours();
            case TimeUnit.MINUTES:
                return date.getMinutes();
            case TimeUnit.SECONDS:
                return date.getSeconds();
            case TimeUnit.MILLISECONDS:
                return date.getMilliseconds();
            default:
                return 0;
        }
    }


    // 差异天数
    static diffDays(createTimeMs: number, curTimeMs: number): number {
        const diffTimeMs = curTimeMs - createTimeMs;
        let dayTimeMs = TimeUnit.DAYS.toMilliseconds(1);
        const diffDays = Math.abs(diffTimeMs / dayTimeMs);
        return Math.floor(diffDays);
    }

    /**
     * 是否同一天
     * @param timeMs1
     * @param timeMs2
     */
    static isSameDayByTimeMs(timeMs1: number, timeMs2: number): boolean {
        const diffDays = this.diffDays(timeMs1, timeMs2);
        return diffDays == 0;
    }
}