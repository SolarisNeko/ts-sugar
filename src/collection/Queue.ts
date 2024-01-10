/**
 * 队列
 */
export default class Queue<T> {

    // 队列数组，用于存储队列元素
    private _queue: T[] = [];

    // 队列大小
    private _size: number = 0;

    // 获取队列大小
    public get size(): number {
        return this._size;
    }

    // 入队操作，在队尾添加元素
    public enqueue(item: T): void {
        this._queue.push(item);
        this._size++;
    }

    // 出队操作，从队头移除元素
    public dequeue(): T | null {
        // 检查队列是否为空
        if (this._size === 0) {
            return null;
        } else {
            this._size--;
            // 从队头移除并返回元素
            return this._queue.shift();
        }
    }

    // 获取队头元素，不移除
    public front(): T | null {
        // 检查队列是否为空
        if (this._size === 0) {
            return null;
        } else {
            // 返回队头元素
            return this._queue[0];
        }
    }

    // 出队操作，从队尾移除元素
    public pop(): T | null {
        // 检查队列是否为空
        if (this._size === 0) {
            return null;
        } else {
            this._size--;
            // 从队尾移除并返回元素
            return this._queue.pop();
        }
    }

    // 获取队头元素，不移除
    public peek(): T | null {
        // 检查队列是否为空
        if (this._size === 0) {
            return null;
        } else {
            // 返回队头元素
            return this._queue[0];
        }
    }

    // 清空队列
    public clear(): void {
        this._queue = [];
        this._size = 0;
    }

    // 检查队列是否为空
    public isEmpty(): boolean {
        return this._size === 0;
    }

    // 将队列转换为字符串
    public toString(): string {
        return this._queue.toString();
    }

    // 将队列转换为数组
    public toArray(): T[] {
        return this._queue;
    }

    // 遍历队列中的每个元素，执行回调函数
    public forEach(callback: (item: T,
                              index: number
    ) => void): void {
        this._queue.forEach(callback);
    }

    // 对队列中的每个元素执行回调函数，并返回新的数组
    public map<U>(callback: (item: T,
                             index: number
    ) => U): U[] {
        return this._queue.map(callback);
    }

    // 过滤队列中的元素，返回新的数组
    public filter(callback: (item: T,
                             index: number
    ) => boolean): T[] {
        return this._queue.filter(callback);
    }
}
