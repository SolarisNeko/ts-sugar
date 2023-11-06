export enum TimeUnit {
    MILLISECONDS = 1,
    SECONDS = 1000,
    MINUTES = 60 * 1000,
    HOURS = 60 * 60 * 1000,
    DAYS = 24 * 60 * 60 * 1000,
}


export class Time {

    // 不建议使用
    static async sleepSync(duration: number, unit: TimeUnit = TimeUnit.MILLISECONDS): Promise<void> {
        await this.sleepAsync(duration, unit)
    }

    // 需要外部自己调用 await
    static sleepAsync(duration: number, unit: TimeUnit = TimeUnit.MILLISECONDS): Promise<void> {
        const milliseconds = duration * unit;
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    static convert(value: number, from: TimeUnit, to: TimeUnit): number {
        return (value * from) / to;
    }
}
