/**
 * 红点树
 */
export class RedDotTree {
    // 红点数据
    private dotMap: Map<string, number>;

    constructor() {
        this.dotMap = new Map();
    }

    // 添加红点
    add(path: string, count: number): void {
        const currentCount = this.dotMap.get(path) || 0;
        this.dotMap.set(path, currentCount + count);
    }

    // 减少红点
    minus(path: string, count: number): void {
        const currentCount = this.dotMap.get(path) || 0;
        this.dotMap.set(path, Math.max(0, currentCount - count));
    }

    // 设置红点
    set(path: string, count: number): void {
        this.dotMap.set(path, Math.max(0, count));
    }

    // 移除红点
    remove(path: string): void {
        this.dotMap.delete(path);
    }

    // 获取红点值
    get(path: string): number {
        let total = 0;

        for (const [key, value] of this.dotMap) {
            if (key.startsWith(path)) {
                total += value;
            }
        }

        return total;
    }
}