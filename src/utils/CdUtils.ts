/**
 * 冷却工具
 *
 * @author luohaojun
 */
export class CdUtils {

    private static _nameToCdMsMap: Map<string, number> = new Map();

    /**
     * 冷却工具装饰器
     *
     * @param cdTimeMs 冷却时间（以毫秒为单位）。
     * @param comment 提示信息。
     * @returns 方法执行后, 会有一段 CD 时间。
     *
     * @code
     *  @CdUtils.ExecuteInCDTimeMs(1000, "挂机奖励领取 CD 中")
     */
    static ExecuteInCDTimeMs(cdTimeMs: number, comment: string = null) {
        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value;

            descriptor.value = function (...args: any[]) {
                const key = `${target?.constructor?.name}_${propertyKey}`;
                const isInCd = CdUtils.isInCd(key, cdTimeMs);
                if (isInCd) {
                    if (comment) {
                        console.warn(comment + ` | cdTimeMs = ${cdTimeMs}`);
                    } else {
                        console.warn(`方法 ${propertyKey} 被调用，但仍在冷却时间内 (${cdTimeMs} ms)。`);

                    }
                    return;
                }

                CdUtils.updateLastExecuteTimeMs(key);
                return originalMethod.apply(this, args);
            };

            return descriptor;
        };
    }

    /**
     * 执行是否在 cd 中? 懒重置 cd
     * @param key 操作的唯一标识键。
     * @param cdTimeMs 毫秒数表示的冷却时间。
     * @returns 如果冷却时间已过，返回 true；否则返回 false。
     */
    public static isInCd(key: string, cdTimeMs: number): boolean {
        const lastTime = this._nameToCdMsMap.get(key);
        const currentTimeMs = Date.now();

        if (lastTime == null) {
            this.updateLastExecuteTimeMs(key, currentTimeMs);
            return false;
        }
        const diffTimeMs = currentTimeMs - lastTime;
        // time rollback
        if (diffTimeMs < 0) {
            this.updateLastExecuteTimeMs(key, currentTimeMs);
            return true;
        }
        // in CD
        if (diffTimeMs < cdTimeMs) {
            return true;
        }

        this.updateLastExecuteTimeMs(key, currentTimeMs);
        return false;
    }

    /**
     * 不在 CD 中
     */
    public static isNotInCd(key: string, cdTimeMs: number) {
        return !this.isInCd(key, cdTimeMs);
    }

    // 修改最后一次执行时间
    static updateLastExecuteTimeMs(key: string, currentTimeMs: number = Date.now()) {
        this._nameToCdMsMap.set(key, currentTimeMs);
    }
}
