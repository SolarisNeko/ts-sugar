/**
 * 基于现实时间的 CdTimer
 */
export class CdTimer {

    // <唯一名, 最后一次执行的时间戳>
    private _nameToPreviousTimeMs: Map<string, number>;
  
    constructor() {
      this._nameToPreviousTimeMs = new Map<string, number>();
    }
  
    /**
     * 检查是否可以执行某个操作，根据键名判断
     * @param key 键名
     * @param cdTimeMs 冷却时间（毫秒）
     * @returns 是否可以执行
     */
    isNotInCd(key: string, cdTimeMs: number): boolean {
      if (!this._nameToPreviousTimeMs.has(key)) {
        return true;
      }
  
      const lastTimeMs = this._nameToPreviousTimeMs.get(key) || 0;
      return this.diffTimeMsFromLast(lastTimeMs) >= cdTimeMs;
    }
  
    /**
     * 执行某个操作并更新计时器
     * @param key 键名
     */
    execute(key: string): void {
      this._nameToPreviousTimeMs.set(key, this.currentUnixTimeMs());
    }
  
    /**
     * 获取距离上次执行经过的时间（毫秒）
     * @param lastTimeMs 上次执行的时间点（毫秒）
     * @returns 时间差（毫秒）
     */
    private diffTimeMsFromLast(lastTimeMs: number): number {
        return this.currentUnixTimeMs() - lastTimeMs;
    }
  
    /**
     * 获取当前时间点（毫秒）
     * @returns 当前时间点 timeMs
     */
    private currentUnixTimeMs(): number {
      return Date.now();
    }
  }
  