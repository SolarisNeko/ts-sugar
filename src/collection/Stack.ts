/**
 * 栈
 */
export class Stack<T> {

    // 私有数组，用于存储栈元素
    private _stack: T[] = [];

    // 将元素推入栈
    public push(item: T): void {
        this._stack.push(item);
    }

    // 从栈中弹出元素
    public pop(): T | null {
        if (this._stack.length <= 0) {
            return null;
        }
        return this._stack.pop();
    }

    // 查看栈顶元素，不移除
    public peek(): T | null {
        if (this._stack.length <= 0) {
            return null;
        }
        return this._stack[this._stack.length - 1];
    }

    // 检查栈是否为空
    public isEmpty(): boolean {
        return this._stack.length === 0;
    }

    // 清空栈
    public clear(): void {
        this._stack = [];
    }

    // 获取栈的大小
    public size(): number {
        return this._stack.length;
    }

    // 遍历栈中的每个元素，执行回调函数
    public forEach(callback: (item: T) => void): void {
        this._stack.forEach(callback);
    }

    // 查找元素在栈中的索引
    public findIndex(predicate: (item: T) => boolean): number {
        return this._stack.findIndex(predicate);
    }

    // 根据索引删除栈中的元素
    public deleteByIndex(index: number): T | null {
        if (index >= 0 && index < this._stack.length) {
            return this._stack.splice(index, 1)[0];
        }
        return null;
    }

    // 批量删除栈中的元素
    public deleteMany(indices: number[]): T[] {
        const deletedItems: T[] = [];
        // 将索引数组排序，确保从大到小删除元素，避免索引错位
        indices.sort((a,
                      b,
        ) => b - a);
        indices.forEach(index => {
            const deletedItem = this.deleteByIndex(index);
            if (deletedItem !== null) {
                deletedItems.push(deletedItem);
            }
        });
        return deletedItems;
    }

    // 根据元素删除栈中的元素
    public deleteByElement(element: T): T | null {
        const index = this._stack.indexOf(element);
        if (index !== -1) {
            return this._stack.splice(index, 1)[0];
        }
        return null;
    }

    // 过滤栈中的元素
    public filter(predicate: (item: T) => boolean): T[] {
        return this._stack.filter(predicate);
    }

    // 过滤后删除栈中的元素
    public filterToDelete(predicate: (item: T) => boolean): T[] {
        const filtered = this._stack.filter(predicate);
        // 删除符合条件的元素
        this._stack = this._stack.filter(item => !predicate(item));
        return filtered;
    }

}
