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
            return null
        }
        return this._stack.pop();
    }

    // 查看栈顶元素，不移除
    public peek(): T | null {
        if (this._stack.length <= 0) {
            return null
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
}
