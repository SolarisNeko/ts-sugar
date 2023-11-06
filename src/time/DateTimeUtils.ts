import AbstractSingleton from "../core/AbstractSingleton";

export default class DateTimeUtils extends AbstractSingleton {

    //  时区：暂时按东八区，需要与服务器一致
    public static readonly TIME_ZONE: string = "+08";

    public constructor() {
        super();
    }

    /**
     /**
     * @deprecated 游戏中不显示具体时间点，用剩余时长表示
     * 表示时间点
     * yyyy-mm-dd hh:mm:ss
     */
    public getDateTimeText(timeMs: number): string {
        var date: Date = new Date(timeMs);
        var year: number = date.getFullYear();
        var month: number = date.getMonth() + 1; 	//返回的月份从0-11；
        var day: number = date.getDate();
        var hours: number = date.getHours();
        var minute: number = date.getMinutes();
        var second: number = date.getSeconds();
        let hoursStr = hours < 10 ? ("0" + hours) : hours.toString();
        let minuteStr = minute < 10 ? ("0" + minute) : minute.toString();
        let secondStr = second < 10 ? ("0" + second) : second.toString();
        return year + "-" + month + "-" + day + " " + hoursStr + ":" + minuteStr + ":" + secondStr;
    }

    public getTomorrowStartTime(time: number = this.currentTimeMs,
                                offsetHour: number = 0
    ): number {
        let date: Date = new Date(time);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
            offsetHour, 0, 0, 0
        )
            .getTime() + 24 * 3600 * 1000;
    }

    public getYesterdayStartTime(time: number = this.currentTimeMs,
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
    public getRefreshDataTime(time: number = this.currentTimeMs,
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
    public getLastRefreshDateTime(time: number = this.currentTimeMs,
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


    public getMonthBySecond(time: number): number {
        var date: Date = new Date(time);
        var month: number = date.getMonth() + 1;
        return month;
    }

    /**
     * 客户端运行时间，仅用于防加速
     */
    public get currentTimeMs(): number {
        return new Date().getTime();
    }

}