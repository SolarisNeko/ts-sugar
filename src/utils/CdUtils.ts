/**
 * 冷却工具
 * 
 * @author luohaojun
 */
export class CdUtils {
    
    private static _nameToCdMsMap: Map<string, number> = new Map();

    /**
     * 检查是否可以执行指定操作。
     * @param key 操作的唯一标识键。
     * @param cdTimeMs 毫秒数表示的冷却时间。
     * @returns 如果冷却时间已过，返回 true；否则返回 false。
     */
    public static isInCd(key: string, cdTimeMs: number): boolean {
        const lastTime = this._nameToCdMsMap.get(key);
        const currentTime = Date.now();

        if (lastTime === undefined || currentTime - lastTime >= cdTimeMs) {
            this._nameToCdMsMap.set(key, currentTime);
            return true;
        } else {
            return false;
        }
    }

    /**
     * 不在 CD 中
     */
    public static isNotInCd(key: string, cdTimeMs: number) {
        return !this.isInCd(key, cdTimeMs);
    }
}
