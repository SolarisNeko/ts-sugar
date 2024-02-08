/**
 * 基于现实时间的 CdTimer
 */
export class CdTimer {
    private cooldowns: Map<string, number>;
  
    constructor() {
      this.cooldowns = new Map<string, number>();
    }
  
    /**
     * 检查是否可以执行某个操作，根据键名判断
     * @param key 键名
     * @param cooldownMs 冷却时间（毫秒）
     * @returns 是否可以执行
     */
    canExecute(key: string, cooldownMs: number): boolean {
      if (!this.cooldowns.has(key)) {
        return true;
      }
  
      const lastExecutionTime = this.cooldowns.get(key) || 0;
      return this.diffTimeMsFromLast(lastExecutionTime) >= cooldownMs;
    }
  
    /**
     * 执行某个操作并更新计时器
     * @param key 键名
     */
    execute(key: string): void {
      this.cooldowns.set(key, this.currentUnixTime());
    }
  
    /**
     * 获取距离上次执行经过的时间（毫秒）
     * @param lastExecutionTime 上次执行的时间点（秒）
     * @returns 时间差（毫秒）
     */
    private diffTimeMsFromLast(lastExecutionTime: number): number {
      return (this.currentUnixTime() - lastExecutionTime) * 1000;
    }
  
    /**
     * 获取当前时间点（秒）
     * @returns 当前时间点（秒）
     */
    private currentUnixTime(): number {
      return Math.floor(Date.now() / 1000);
    }
  }
  