/**
 * 基于逻辑帧的 Cd
 */
export class FrameCdTimer {

  // 每一帧消耗ms
  private frameCostMs: number;
  // cdTimer 和上一次执行的第几帧
  private timers: Map<string, number>;

  constructor(frameCostMs: number) {
    this.frameCostMs = frameCostMs;
    this.timers = new Map<string, number>();
  }

  /**
   * 检查是否可以执行某个操作，根据键名判断
   * @param key 键名
   * @returns 是否可以执行
   */
  canExecute(key: string): boolean {
    if (!this.timers.has(key)) {
      return true;
    }

    const lastFrame = this.timers.get(key) || 0;
    return this.frameCountSince(lastFrame) >= 1; // 逻辑帧数差至少为1
  }

  /**
   * 执行某个操作并更新计时器
   * @param key 键名
   * @param cdMs 冷却时间（毫秒）
   */
  execute(key: string, cdMs: number): void {
    const currentFrame = this.currentFrame();
    const nextFrame = Math.ceil((currentFrame * this.frameCostMs + cdMs) / this.frameCostMs);
    this.timers.set(key, nextFrame);
  }

  /**
   * 获取距离上次执行经过的帧数
   * @param lastFrame 上次执行的帧数
   * @returns 帧数差
   */
  private frameCountSince(lastFrame: number): number {
    return this.currentFrame() - lastFrame;
  }

  /**
   * 获取当前帧数
   * @returns 当前帧数
   */
  private currentFrame(): number {
    return Math.floor(Date.now() / this.frameCostMs);
  }
}
