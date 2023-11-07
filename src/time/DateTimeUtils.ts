/**
 * 2023-10-25T13:30:00Z = UTC+0 timezone
 * 2023-10-25T13:30:00 = UTC+${当前时区} = UTC+8 default
 */
export default class DateTimeUtils {

    //  时区：暂时按东八区，需要与服务器一致
    public static readonly TIME_ZONE: string = "+08";

    /**
     * DateTime Format = "yyyy-MM-dd HH:mm:ss"
     * 表示时间点
     * yyyy-mm-dd hh:mm:ss
     */
    public static getDateTimeText(timeMs: number): string {
        let date: Date = new Date(timeMs);
        let year: number = date.getFullYear();
        let month: number = date.getMonth() + 1; 	//返回的月份从0-11；
        let day: number = date.getDate();
        let hours: number = date.getHours();
        let minute: number = date.getMinutes();
        let second: number = date.getSeconds();
        let hoursStr = hours < 10 ? ("0" + hours) : hours.toString();
        let minuteStr = minute < 10 ? ("0" + minute) : minute.toString();
        let secondStr = second < 10 ? ("0" + second) : second.toString();
        return year + "-" + month + "-" + day + " " + hoursStr + ":" + minuteStr + ":" + secondStr;
    }

    public static getTomorrowStartTime(time: number = this.currentTimeMs,
                                       offsetHour: number = 0
    ): number {
        let date: Date = new Date(time);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
            offsetHour, 0, 0, 0
        )
            .getTime() + 24 * 3600 * 1000;
    }

    public static getYesterdayStartTime(time: number = this.currentTimeMs,
                                        offsetHour: number = 0
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
                                     offsetHour: number = 0
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
    public static getLastRefreshDateTime(time: number = this.currentTimeMs,
                                         offsetHour: number = 0
    ): number {
        let date = new Date(time);
        if (date.getHours() < offsetHour) {
            return this.getYesterdayStartTime(time) + (24 + offsetHour % 24) * 3600 * 1000;
        } else {
            return new Date(date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                0,
                0,
                0,
                0).getTime() + offsetHour * 3600 * 1000;
        }
    }


    public static getMonthBySecond(time: number): number {
        let date: Date = new Date(time);
        let month: number = date.getMonth() + 1;
        return month;
    }

    /**
     * 客户端运行时间，仅用于防加速
     */
    public static get currentTimeMs(): number {
        return new Date().getTime();
    }

}