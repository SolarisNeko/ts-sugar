/**
 * 计时器
 */
export class StopWatch233 {
    // 开始时间
    private _startTimeMs: number = 0;
    // 累计时间
    private _elapsedTimeMs: number = 0;
    // 计时状态
    private _isRunning: boolean = false;
    // 分段时间记录
    private laps: number[] = [];

    // 无参构造函数
    constructor() {
    }

    // 开始计时
    start(): void {
        if (!this._isRunning) {
            this._startTimeMs = performance.now();
            this._isRunning = true;
        }
    }

    // 停止计时
    stop(): void {
        if (this._isRunning) {
            this._elapsedTimeMs += performance.now() - this._startTimeMs;
            this._isRunning = false;
        }
    }

    // 重置计时器
    reset(): void {
        this._startTimeMs = 0;
        this._elapsedTimeMs = 0;
        this._isRunning = false;
        this.laps = [];
    }

    // 记录当前分段时间
    lap(): void {
        if (this._isRunning) {
            this.laps.push(this.getElapsedTimeMs());
        }
    }

    // 获取已计时的毫秒数
    getElapsedTimeMs(): number {
        if (this._isRunning) {
            return this._elapsedTimeMs + (performance.now() - this._startTimeMs);
        }
        return this._elapsedTimeMs;
    }

    // 获取所有分段时间
    getLaps(): number[] {
        return this.laps;
    }

    // 判断计时器是否在运行
    isRunning(): boolean {
        return this._isRunning;
    }

// 格式化时间输出
    formatTime(milliseconds: number): string {
        const seconds = Math.floor((milliseconds / 1000) % 60);
        const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
        const ms = Math.floor(milliseconds % 1000);

        // 手动格式化为两位数或三位数的字符串
        const formatNumber = (num: number, length: number): string => {
            let str = num.toString();
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        };

        const hourStr = formatNumber(hours, 2);
        const minStr = formatNumber(minutes, 2);
        const secStr = formatNumber(seconds, 2);
        const msStr = formatNumber(ms, 3);

        return `${hourStr}:${minStr}:${secStr}.${msStr}`;
    }


    // 获取格式化的已计时时间
    getFormattedElapsedTime(): string {
        return this.formatTime(this.getElapsedTimeMs());
    }

    // 获取所有分段时间的格式化输出
    getFormattedLaps(): string[] {
        return this.laps.map((lap, index) => `Lap ${index + 1}: ${this.formatTime(lap)}`);
    }
}
