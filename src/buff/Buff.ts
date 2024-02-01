// 定义 Buff 接口，无状态的 API 定义
interface BuffApi<T extends BuffApi<T>> {
    merge(otherBuff: T): void;

    isSameBuff(otherBuff: T): boolean;

    // 重复 buff 添加
    handleDuplicateBuffAddTime(buffTime: BuffExpireState): void;
}

class BuffExpireState {
    // 开始时间
    startTimeMs: number;
    // 持续时间
    durationMs: number;
    // 累加次数
    addCount: number;

    getExpireTimeMs(): number {
        return this.startTimeMs + this.durationMs;
    }
}
//
// class BuffState<T extends BuffApi<any>> {
//     buffExpireState: BuffExpireState;
//     buffApi: BuffApi<T>;
//
//     constructor(buffApi: BuffApi<T>, startTimeMs: number, durationMs: number, addCount: number) {
//         this.buffApi = buffApi;
//         this.buffExpireState = { startTimeMs, durationMs, addCount };
//     }
// }
//
// // 管理一系列 PlayerBuff 的 BuffBox 类
// class BuffBox<Player> {
//     private buffs: Map<string, BuffState<any>> = new Map();
//
//     // 添加 Buff
//     addBuff(key: string, buffApi: BuffApi<any>, duration: number): void {
//         this.clearExpiredBuffs(); // 清理过期的 Buff
//
//         const existingBuffState = this.buffs.get(key);
//
//         if (existingBuffState) {
//             const currentTime = Date.now();
//             const duplicateBuff = { startTimeMs: currentTime, durationMs: duration, addCount: 1 };
//
//             existingBuffState.buffApi.handleDuplicateBuffAddTime(duplicateBuff);
//             existingBuffState.buffExpireState.addCount++;
//             existingBuffState.buffExpireState.durationMs += duration;
//         } else {
//             const currentTime = Date.now();
//             const newBuffState = new BuffState(buffApi, currentTime, duration, 1);
//             this.buffs.set(key, newBuffState);
//         }
//     }
//
//     // 移除 Buff
//     removeBuff(key: string): void {
//         this.buffs.delete(key);
//     }
//
//     // 更新所有 Buff
//     update(): void {
//         this.clearExpiredBuffs(); // 清理过期的 Buff
//     }
//
//     // 清理过期的 Buff
//     private clearExpiredBuffs(): void {
//         const currentTime = Date.now();
//         const expiredBuffKeys: string[] = [];
//
//         for (const [key, buffState] of this.buffs) {
//             if (currentTime - buffState.buffExpireState.startTimeMs >= buffState.buffExpireState.durationMs) {
//                 expiredBuffKeys.push(key);
//             }
//         }
//
//         for (const key of expiredBuffKeys) {
//             this.buffs.delete(key);
//         }
//     }
//
//     // 获取所有 Buff
//     getBuffs(): Map<string, BuffApi<any>> {
//         this.clearExpiredBuffs(); // 清理过期的 Buff
//         const result: Map<string, BuffApi<any>> = new Map();
//
//         for (const [key, buffState] of this.buffs) {
//             result.set(key, buffState.buffApi);
//         }
//
//         return result;
//     }
// }
