/**
 * 二叉堆 | 排序的数组快速二分索引 + 顺序
 */
export class BinaryHeap<T> {

    // 用于存储二叉堆中的元素。它被初始化为 null，表示当前没有元素。
    private _content: T[] = null;
    // 用于评估元素的优先级函数
    private readonly _score: (item: T) => number = null;

    /**
     * 创建一个二叉堆实例。
     * @param score - 评分函数，用于评估元素的优先级。
     */
    constructor(score: (item: T) => number) {
        this._content = new Array<T>();
        this._score = score;
    }

    /**
     * 向二叉堆中添加一个元素。
     * @param element - 要添加的元素。
     */
    push(element: T): void {
        this._content.push(element);
        this.downIndex(this._content.length - 1);
    }

    /**
     * 从二叉堆中弹出具有最高优先级的元素。
     * @returns - 返回弹出的元素。
     */
    pop(): T {
        const result = this._content[0];
        const end = this._content.pop();
        if (this._content.length > 0) {
            this._content[0] = end;
            this.upIndex(0);
        }
        return result;
    }

    /**
     * 从二叉堆中移除指定的元素。
     * @param element - 要移除的元素。
     */
    remove(element: T): void {
        const index = this._content.indexOf(element);
        const end = this._content.pop();
        if (index !== this._content.length - 1) {
            this._content[index] = end;
            if (this._score(end) < this._score(element)) {
                this.downIndex(index);
            } else {
                this.upIndex(index);
            }
        }
    }

    /**
     * 获取二叉堆的大小。
     * @returns - 返回二叉堆中元素的数量。
     */
    size(): number {
        return this._content.length;
    }

    /**
     * 清空二叉堆中的所有元素。
     */
    clear(): void {
        this._content = new Array<T>();
    }

    /**
     * 重新评分指定元素的优先级。
     * @param element - 要重新评分的元素。
     */
    resetScore(element: T): void {
        let index = this._content.indexOf(element);
        this.downIndex(index);
    }

    /**
     * 评分降级. 遍历顺序降低
     * @param index
     */
    downIndex(index: number): void {
        const element = this._content[index];
        while (index > 0) {
            const parent_index = ((index + 1) >> 1) - 1;
            const parent = this._content[parent_index];
            if (this._score(element) < this._score(parent)) {
                this._content[parent_index] = element;
                this._content[index] = parent;
                index = parent_index;
            } else {
                break;
            }
        }
    }

    /**
     * 评分升级
     * @param index
     */
    upIndex(index: number): void {
        const length = this._content.length;
        const element = this._content[index];
        const elem_score = this._score(element);
        while (true) {
            const child2_index = (index + 1) << 1;
            const child1_index = child2_index - 1;
            let swap = null, child1_score = null;
            if (child1_index < length) {
                const child1 = this._content[child1_index];
                child1_score = this._score(child1);

                if (child1_score < elem_score) {
                    swap = child1_index;
                }
            }
            if (child2_index < length) {
                const child2 = this._content[child2_index];
                const child2_score = this._score(child2);
                if (child2_score < (swap === null ? elem_score : child1_score)) {
                    swap = child2_index;
                }
            }
            if (swap !== null) {
                this._content[index] = this._content[swap];
                this._content[swap] = element;
                index = swap;
            } else {
                break;
            }
        }
    }
}
