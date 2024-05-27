// Cron233，解析和验证 6 位 cron 表达式，并计算未来的执行时间
export class Cron233 {
    private _cron: string = "";
    private seconds: string;
    private minutes: string;
    private hours: string;
    private dayOfMonth: string;
    private month: string;
    private dayOfWeek: string;

    // 无参构造函数
    constructor() {
        this.seconds = '';
        this.minutes = '';
        this.hours = '';
        this.dayOfMonth = '';
        this.month = '';
        this.dayOfWeek = '';
    }

    static create(cron: string): Cron233 {
        const cron233 = new Cron233();
        if (cron) {
            cron233.setCron(cron)
        }
        return cron233
    }

    // 设置 cron 表达式
    setCron(cron: string,
            throwErrorIfNotValid: boolean = false,
    ): void {
        const parts = cron.split(' ');
        if (parts.length !== 6) {
            throw new Error('Invalid cron expression. It must have 6 parts.');
        }

        this._cron = cron

        this.seconds = parts[0];
        this.minutes = parts[1];
        this.hours = parts[2];
        this.dayOfMonth = parts[3];
        this.month = parts[4];
        this.dayOfWeek = parts[5];

        if (throwErrorIfNotValid) {

            if (!this.validate()) {
                throw new Error(`Error cron expression. cron = ${this._cron} `);
            }
        }
    }

    // 获取 cron 表达式的各部分
    getSeconds(): string {
        return this.seconds;
    }

    getMinutes(): string {
        return this.minutes;
    }

    getHours(): string {
        return this.hours;
    }

    getDayOfMonth(): string {
        return this.dayOfMonth;
    }

    getMonth(): string {
        return this.month;
    }

    getDayOfWeek(): string {
        return this.dayOfWeek;
    }

    // 验证 cron 表达式的格式
    validate(): boolean {
        return (
            this.validatePart(this.seconds, 0, 59) &&
            this.validatePart(this.minutes, 0, 59) &&
            this.validatePart(this.hours, 0, 23) &&
            this.validatePart(this.dayOfMonth, 1, 31) &&
            this.validatePart(this.month, 1, 12) &&
            this.validatePart(this.dayOfWeek, 0, 6)
        );
    }

    // 验证每个部分的有效性
    private validatePart(part: string,
                         min: number,
                         max: number,
    ): boolean {
        const regex = /^(\*|([0-9]|[1-5][0-9])(\/[0-9]+)?|\?|\-|\,)+$/;
        if (!regex.test(part)) {
            return false;
        }

        const numbers = part.split(/[,\/\-]/).map(p => (p === '*' ? null : parseInt(p)));
        for (const number of numbers) {
            if (number !== null && (number < min || number > max)) {
                return false;
            }
        }

        return true;
    }

    // 计算未来第 n 次的执行时间
    calculateNextRun(currentEpochTimeMs: number,
                     nextCount: number = 1,
    ): number[] {
        const result: number[] = [];
        const date = new Date(currentEpochTimeMs);

        while (nextCount > 0) {
            date.setUTCSeconds(date.getUTCSeconds() + 1); // 每次递增 1 秒来查找下一个有效时间
            if (this.isValidDate(date)) {
                result.push(date.getTime());
                nextCount--;
            }
        }

        return result;
    }

    // 检查日期是否符合 cron 表达式
    private isValidDate(date: Date): boolean {
        return this.isValidPart(date.getUTCSeconds(), this.seconds) &&
            this.isValidPart(date.getUTCMinutes(), this.minutes) &&
            this.isValidPart(date.getUTCHours(), this.hours) &&
            this.isValidPart(date.getUTCDate(), this.dayOfMonth) &&
            this.isValidPart(date.getUTCMonth() + 1, this.month) &&
            this.isValidPart(date.getUTCDay(), this.dayOfWeek);
    }

    // 检查时间部分是否有效
    private isValidPart(value: number,
                        part: string,
    ): boolean {
        if (part === '*') {
            return true;
        }

        const values = part.split(',').map(p => p.trim());
        for (const val of values) {
            if (val.includes('-')) {
                const [start, end] = val.split('-').map(v => parseInt(v));
                if (value >= start && value <= end) {
                    return true;
                }
            } else if (val.includes('/')) {
                const [baseStr, stepStr] = val.split('/');
                const base = baseStr === '*' ? '*' : parseInt(baseStr);
                const step = parseInt(stepStr);

                if (typeof base === 'string' && base === '*') {
                    if (value % step === 0) {
                        return true;
                    }
                } else if (typeof base === 'number') {
                    if ((value - base) % step === 0) {
                        return true;
                    }
                }
            } else if (parseInt(val) === value) {
                return true;
            }
        }

        return false;
    }
}

