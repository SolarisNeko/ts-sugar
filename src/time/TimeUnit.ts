/**
 * 时间单位
 */
class TimeUnit {
    // 等效于毫秒
    private readonly _milliseconds: number;

    private constructor(milliseconds: number) {
        this._milliseconds = milliseconds;
    }

    // 毫秒
    static readonly MILLISECONDS = new TimeUnit(1);
    // 秒
    static readonly SECONDS = new TimeUnit(1000);
    // 分钟
    static readonly MINUTES = new TimeUnit(60 * 1000);
    // 小时
    static readonly HOURS = new TimeUnit(60 * 60 * 1000);
    // 天
    static readonly DAYS = new TimeUnit(24 * 60 * 60 * 1000);

    /**
     * 创建一个自己的时间
     * @param value
     * @param unit
     */
    static create(value: number, unit: TimeUnit): TimeUnit {
        return new TimeUnit(value * unit._milliseconds);
    }

    // 转为其他单位
    to(value: number, fromUnit: TimeUnit): number {
        return (value * fromUnit._milliseconds) / this._milliseconds;
    }

    // 转换为毫秒
    toMilliseconds(value: number): number {
        return value * this._milliseconds;
    }

    // 转换为秒
    toSeconds(value: number): number {
        return value * this._milliseconds / TimeUnit.SECONDS._milliseconds;
    }

    // 转换为分钟
    toMinutes(value: number): number {
        return value * this._milliseconds / TimeUnit.MINUTES._milliseconds;
    }

    // 转换为小时
    toHours(value: number): number {
        return value * this._milliseconds / TimeUnit.HOURS._milliseconds;
    }

    // 转换为天
    toDays(value: number): number {
        return value * this._milliseconds / TimeUnit.DAYS._milliseconds;
    }

}

class Time {
    // 不建议使用
    static async sleepSync(duration: number, unit: TimeUnit = TimeUnit.MILLISECONDS): Promise<void> {
        await this.sleepAsync(duration, unit);
    }

    // 需要外部自己调用 await
    static sleepAsync(duration: number, unit: TimeUnit = TimeUnit.MILLISECONDS): Promise<void> {
        const milliseconds = unit.toMilliseconds(duration);
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    static convert(value: number, from: TimeUnit, unit: TimeUnit): number {
        return unit.to(value, from);
    }
}