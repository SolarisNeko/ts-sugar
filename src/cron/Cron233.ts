// CronOptions类型定义
export type CronOptions = {
    name?: string;                    // 任务名称
    paused?: boolean;                 // 是否暂停任务
    kill?: boolean;                   // 是否终止任务
    catch?: boolean | CatchCallbackFn;// 是否捕获异常或捕获回调函数
    unref?: boolean;                  // 是否解除引用
    maxRuns?: number;                 // 最大运行次数
    interval?: number;                // 间隔时间（毫秒）
    protect?: boolean | ProtectCallbackFn; // 是否保护或保护回调函数
    startAt?: string | Date;          // 任务开始时间
    stopAt?: string | Date;           // 任务停止时间
    timezone?: string;                // 时区
    utcOffset?: number;               // UTC偏移量
    legacyMode?: boolean;             // 旧模式兼容
    context?: any;                    // 上下文
};

// 捕获异常回调函数类型定义
export type CatchCallbackFn = (e: unknown, job: Cron233) => void;

// 保护回调函数类型定义
export type ProtectCallbackFn = (job: Cron233) => void;

/**
 * Cron233 表达式解析器
 */
export class Cron233 {
    // cron 表达式
    private pattern: string;
    // 时区
    private timezone: string | undefined;
    // 选项
    private options: CronOptions;

    constructor(pattern: string, options: CronOptions = {}) {
        this.pattern = pattern;
        this.options = this.validateOptions(options);
        this.timezone = this.options.timezone;
    }

    // 校验选项并设置默认值
    private validateOptions(options: CronOptions): CronOptions {
        // 设置默认值
        options.legacyMode = options.legacyMode ?? true;
        options.paused = options.paused ?? false;
        options.maxRuns = options.maxRuns ?? Infinity;
        options.catch = options.catch ?? false;
        options.interval = options.interval ?? 0;
        options.unref = options.unref ?? false;

        // 校验 interval
        if (isNaN(options.interval)) {
            throw new Error("CronOptions: Supplied value for interval is not a number");
        } else if (options.interval < 0) {
            throw new Error("CronOptions: Supplied value for interval can not be negative");
        }

        // 校验 utcOffset
        if (options.utcOffset !== undefined) {
            if (isNaN(options.utcOffset)) {
                throw new Error("CronOptions: Invalid value passed for utcOffset, should be number representing minutes offset from UTC.");
            } else if (options.utcOffset < -870 || options.utcOffset > 870) {
                throw new Error("CronOptions: utcOffset out of bounds.");
            }
            if (options.utcOffset !== undefined && options.timezone) {
                throw new Error("CronOptions: Combining 'utcOffset' with 'timezone' is not allowed.");
            }
        }

        return options;
    }

    // 检查给定的日期是否匹配 Cron233 表达式
    public matches(date: Date): boolean {
        const parts = this.pattern.split(' ');
        if (parts.length !== 6) {
            throw new Error("Cron233 pattern must have exactly 6 parts");
        }

        const [second, minute, hour, day, month, dayOfWeek] = parts;

        return (
            this.matchesPart(date.getSeconds(), second) &&
            this.matchesPart(date.getMinutes(), minute) &&
            this.matchesPart(date.getHours(), hour) &&
            this.matchesPart(date.getDate(), day) &&
            this.matchesPart(date.getMonth() + 1, month) &&
            this.matchesPart(date.getDay(), dayOfWeek)
        );
    }

    // 检查单个部分是否匹配
    private matchesPart(value: number, pattern: string): boolean {
        if (pattern === '*') {
            return true;
        }

        if (pattern.includes('/')) {
            const [range, step] = pattern.split('/');
            if (range === '*') {
                return value % parseInt(step) === 0;
            }
        }

        return pattern.split(',').some(part => {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                return value >= start && value <= end;
            }
            return value === parseInt(part);
        });
    }

    // 获取下 n 次的 Cron233 生效时间
    public getNextRuns(startDate: Date, n: number): Date[] {
        const nextRuns: Date[] = [];
        let date = new Date(startDate.getTime());

        // 循环查找下 n 次匹配的时间
        while (nextRuns.length < n) {
            // 增加时间，避免死循环
            date = this.incrementDate(date);

            if (this.matches(date)) {
                nextRuns.push(new Date(date.getTime()));
            }
        }

        return nextRuns;
    }

    // 按顺序递增时间，避免死循环
    private incrementDate(date: Date): Date {
        date.setSeconds(date.getSeconds() + 1);
        if (date.getSeconds() === 0) {
            date.setMinutes(date.getMinutes() + 1);
            if (date.getMinutes() === 0) {
                date.setHours(date.getHours() + 1);
                if (date.getHours() === 0) {
                    date.setDate(date.getDate() + 1);
                    if (date.getDate() === 1) {
                        date.setMonth(date.getMonth() + 1);
                        if (date.getMonth() === 0) {
                            date.setFullYear(date.getFullYear() + 1);
                        }
                    }
                }
            }
        }
        return date;
    }
}
