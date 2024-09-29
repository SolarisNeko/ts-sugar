/**
 * 日期时间
 */
export class DateTime233 {
    // 日期
    private _date: Date;
    // 节假日 <yyyy-MM-dd, holiday name>
    private static holidayToNameMap: Map<string, string> = new Map();

    // 无参构造函数，默认使用当前时间
    private constructor(date?: Date) {
        this._date = date ? new Date(date) : new Date();
    }

    /**
     * 创建日期对象
     * @param date 日期对象或时间戳或字符串 "yyyy-MM-dd HH:mm:ss.SSS"
     */
    static create(date: Date | number | string): DateTime233 {
        if (typeof date === "string") {
            // 正则表达式匹配 "yyyy-MM-dd HH:mm:ss.SSS"
            const regex = /(\d{4})-(\d{2})-(\d{2}) ?(\d{2})?:?(\d{2})?:?(\d{2})?(?:\.(\d{3}))?/;
            const match = regex.exec(date);

            if (match) {
                const year = parseInt(match[1], 10);
                const month = parseInt(match[2], 10) - 1; // 月份从 0 开始
                const day = parseInt(match[3], 10);
                const hour = match[4] ? parseInt(match[4], 10) : 0; // 默认0
                const minute = match[5] ? parseInt(match[5], 10) : 0; // 默认0
                const second = match[6] ? parseInt(match[6], 10) : 0; // 默认0
                const millisecond = match[7] ? parseInt(match[7], 10) : 0; // 默认0

                return new DateTime233(new Date(year, month, day, hour, minute, second, millisecond));
            } else {
                throw new Error("Invalid date string format. Expected format: 'yyyy-MM-dd HH:mm:ss.SSS'");
            }
        }

        if (typeof date === "number") {
            date = new Date(date);
        }

        return new DateTime233(date);
    }


    // 获取当前日期时间
    public static now(): DateTime233 {
        return new DateTime233();
    }

    /**
     * 注册节假日
     * @param date 日期
     * @param holidayName 节假日名称
     */
    public static registerHoliday(date: DateTime233, holidayName: string): void {
        this.holidayToNameMap.set(date.toString('yyyy-MM-dd'), holidayName);
    }

    // 检查今天是否是节假日
    public isHoliday(): boolean {
        const todayString = this.toString('yyyy-MM-dd');
        return DateTime233.holidayToNameMap.has(todayString);
    }

    // 检查今天是否是节假日
    public isHolidayToday(): boolean {
        const todayString = this.toString('yyyy-MM-dd');
        return DateTime233.holidayToNameMap.has(todayString);
    }

    // 获取日期
    public getDate(): Date {
        return this._date;
    }

    // 获取时间戳 ms
    public getEpochTimeMs(): number {
        return this._date.getTime();
    }

    // 获取时区偏移量（以小时为单位）
    public getTimeOffsetHours(): number {
        // getTimezoneOffset 返回的是分钟，取负值并转换为小时
        const timezoneOffset = this._date.getTimezoneOffset();
        if (timezoneOffset == 0) {
            return 0;
        }
        return -timezoneOffset / 60;
    }

// 获取时区偏移量（以毫秒为单位）
    public getTimeOffsetTimeMs(): number {
        // 转换为毫秒
        return -this._date.getTimezoneOffset() * 60 * 1000;
    }


// 转换为字符串
    public toString(format: string = 'yyyy-MM-dd HH:mm:ss.SSS'): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };

        let dateString = this._date.toLocaleString('en-US', options).replace(',', '');

        // 获取毫秒并格式化为三位数
        let milliseconds = this._date.getMilliseconds();
        let millisecondsString = (milliseconds < 100 ? '0' : '') + (milliseconds < 10 ? '0' : '') + milliseconds;

        // 根据格式添加毫秒
        if (format.includes('SSS')) {
            dateString += `.${millisecondsString}`;
        }

        return dateString;
    }


    // 获取星期几
    public getDayOfWeek1to7(): number {
        const day = this._date.getDay();
        if (day === 0) {
            // 星期日
            return 7;
        }
        // 0-6 (0: Sunday, 1: Monday, ..., 6: Saturday)
        return day;
    }

    // 获取年份
    public getYear(): number {
        return this._date.getFullYear();
    }

// 获取月份（1-12）
    public getMonth(): number {
        return this._date.getMonth() + 1; // 月份从 0 开始
    }

// 获取日期
    public getDay(): number {
        return this._date.getDate();
    }

// 获取小时（0-23）
    public getHour(): number {
        return this._date.getHours();
    }

// 获取分钟（0-59）
    public getMinute(): number {
        return this._date.getMinutes();
    }

// 获取秒数（0-59）
    public getSecond(): number {
        return this._date.getSeconds();
    }

// 获取毫秒（0-999）
    public getMillisecond(): number {
        return this._date.getMilliseconds();
    }


    // 增加时间
    public plusYears(years: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setFullYear(newDate.getFullYear() + years);
        return new DateTime233(newDate);
    }

    public plusMonths(months: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setMonth(newDate.getMonth() + months);
        return new DateTime233(newDate);
    }

    public plusDays(days: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setDate(newDate.getDate() + days);
        return new DateTime233(newDate);
    }

    public plusHours(hours: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setHours(newDate.getHours() + hours);
        return new DateTime233(newDate);
    }

    public plusMinutes(minutes: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setMinutes(newDate.getMinutes() + minutes);
        return new DateTime233(newDate);
    }

    public plusSeconds(seconds: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setSeconds(newDate.getSeconds() + seconds);
        return new DateTime233(newDate);
    }

    // 减少时间
    public minusYears(years: number): DateTime233 {
        return this.plusYears(-years);
    }

    public minusMonths(months: number): DateTime233 {
        return this.plusMonths(-months);
    }

    public minusDays(days: number): DateTime233 {
        return this.plusDays(-days);
    }

    public minusHours(hours: number): DateTime233 {
        return this.plusHours(-hours);
    }

    public minusMinutes(minutes: number): DateTime233 {
        return this.plusMinutes(-minutes);
    }

    public minusSeconds(seconds: number): DateTime233 {
        return this.plusSeconds(-seconds);
    }

    // 设置为特定的日期和时间
    public at(year: number, month: number, day: number, hour: number = 0, minute: number = 0, second: number = 0, ms: number = 0): DateTime233 {
        const newDate = new Date(year, month, day, hour, minute, second, ms);
        return new DateTime233(newDate);
    }


    // 设置年
    public withYear(year: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setFullYear(year);
        return new DateTime233(newDate);
    }

    // 设置月
    public withMonth(month: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setMonth(month);
        return new DateTime233(newDate);
    }

    // 设置日
    public withDay(day: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setDate(day);
        return new DateTime233(newDate);
    }

    // 设置小时
    public withHour(hour: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setHours(hour);
        return new DateTime233(newDate);
    }

    // 设置分钟
    public withMinute(minute: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setMinutes(minute);
        return new DateTime233(newDate);
    }

    // 设置秒
    public withSecond(second: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setSeconds(second);
        return new DateTime233(newDate);
    }

    // 设置毫秒
    public withMillisecond(millisecond: number): DateTime233 {
        const newDate = new Date(this._date);
        newDate.setMilliseconds(millisecond);
        return new DateTime233(newDate);
    }

    /**
     *  计算两个 DateTime 之间的时间差（毫秒）
     * @param other > 0 = 当前时间之前， < 0 = 当前时间之后
     */
    public diff(other: DateTime233): number {
        return this.getEpochTimeMs() - other.getEpochTimeMs();
    }

    // 获取下一周
    public nextWeek(): DateTime233 {
        return this.plusDays(7);
    }

    // 获取上一周
    public previousWeek(): DateTime233 {
        return this.minusDays(7);
    }

    // 获取季度（1-4）
    public getQuarter(): number {
        return Math.floor(this.getMonth() / 3) + 1;
    }

    // 判断是否是闰年
    public isLeapYear(): boolean {
        const year = this.getYear();
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // 获取月份的天数
    public getDaysInMonth(): number {
        const month = this.getMonth();
        const year = this.getYear();
        return new Date(year, month, 0).getDate(); // 0 返回上一个月的最后一天
    }

    // 计算两个 DateTime 之间的差距（返回一个对象）
    public diffInYears(other: DateTime233): number {
        return this.getYear() - other.getYear();
    }

    public diffInMonths(other: DateTime233): number {
        return this.diffInYears(other) * 12 + (this.getMonth() - other.getMonth());
    }

    public diffInDays(other: DateTime233): number {
        return Math.floor(this.diff(other) / (1000 * 60 * 60 * 24));
    }

    // 设置为本月最后一天
    public withEndOfMonth(): DateTime233 {
        const year = this.getYear();
        const month = this.getMonth();
        const lastDay = new Date(year, month, 0).getDate();
        return this.at(year, month - 1, lastDay);
    }

    // 设置为本年最后一天
    public withEndOfYear(): DateTime233 {
        return this.at(this.getYear(), 11, 31); // 12月31日
    }

    /**
     * 可用的格式符号：
     * yyyy: 年
     * MM: 月
     * dd: 日
     * HH: 小时
     * mm: 分钟
     * ss: 秒
     * SSS: 毫秒
     *
     * @param format 例子: 'yyyy-MM-dd HH:mm:ss.SSS'
     */
    public format(format: string): string {
        const pad = (num: number, length: number): string => {
            return ('0'.repeat(length) + num).slice(-length);
        };

        const replacements: { [key: string]: string } = {
            'yyyy': this.getYear().toString(),
            'MM': pad(this.getMonth(), 2),
            'dd': pad(this.getDay(), 2),
            'HH': pad(this.getHour(), 2),
            'mm': pad(this.getMinute(), 2),
            'ss': pad(this.getSecond(), 2),
            'SSS': pad(this.getMillisecond(), 3),
        };

        return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS/g, match => replacements[match]);
    }


}