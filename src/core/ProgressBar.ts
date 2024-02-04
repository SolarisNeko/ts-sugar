/**
 * 单个数值进度条
 */
export class ProgressBar {
    // 当前进度值
    private _curProgressValue: number = 0;
    // 最大进度值
    private readonly _maxProgressValue: number = 0;

    // 构造函数，初始化最大进度值
    constructor(maxProgressValue: number) {
        this._maxProgressValue = maxProgressValue;
    }

    // 获取当前进度值
    get curProgressValue(): number {
        return this._curProgressValue;
    }

    // 设置当前进度值，使用 Math.min 和 Math.max 来确保在合法范围内
    set curProgressValue(value: number) {
        this._curProgressValue = Math.min(this._maxProgressValue, Math.max(0, value));
    }

    // 获取最大进度值
    get maxProgressValue(): number {
        return this._maxProgressValue;
    }

    // 计算当前进度的百分比，保留两位小数
    getProgressPercent(): number {
        const rawPercent = this._curProgressValue / this._maxProgressValue;
        return parseFloat((Math.min(1, Math.max(0, rawPercent)) * 100).toFixed(2));
    }


    getProgressPercentStr(): string {
        return this.getProgressPercent() + "%"
    }

    // 检查是否已完成
    isComplete(): boolean {
        return this._curProgressValue >= this._maxProgressValue;
    }

}

