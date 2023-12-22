// LinkedListNode 类表示链表中的节点
export class LinkedListNode<K, V> {
    key: K;
    value: V;
    next: LinkedListNode<K, V> | null = null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}

// HashMap 类表示 HashMap 数据结构
export  class HashMap<K, V> {
    private static readonly DEFAULT_CAPACITY = 16; // 默认容量
    private static readonly LOAD_FACTOR = 0.75; // 负载因子

    private capacity: number;
    private size: number = 0;
    private buckets: Array<LinkedListNode<K, V> | null>;

    constructor(capacity: number = HashMap.DEFAULT_CAPACITY) {
        this.capacity = capacity;
        this.buckets = new Array(this.capacity).fill(null);
    }

    // 哈希函数：将键映射到桶索引
    private hash(key: K): number {
        const hash = String(key).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hash % this.capacity;
    }

    // 向 HashMap 中插入键值对
    public put(key: K, value: V): void {
        const index = this.hash(key);

        // 获取桶中的链表
        let current = this.buckets[index];
        let prev: LinkedListNode<K, V> | null = null;

        // 遍历链表，查找键是否已存在
        while (current !== null) {
            if (current.key === key) {
                // 如果键已存在，更新值
                current.value = value;
                return;
            }
            prev = current;
            current = current.next;
        }

        // 键不存在，创建新节点
        const newNode = new LinkedListNode(key, value);

        // 将新节点插入链表
        if (prev === null) {
            this.buckets[index] = newNode; // 链表为空，直接插入
        } else {
            prev.next = newNode; // 链表不为空，在链表尾部插入
        }

        this.size++;

        // 检查是否需要扩容
        if (this.size > this.capacity * HashMap.LOAD_FACTOR) {
            this.resize();
        }
    }

    // 从 HashMap 中获取键对应的值
    public get(key: K): V | null {
        const index = this.hash(key);

        // 获取桶中的链表
        let current = this.buckets[index];

        // 遍历链表，查找键
        while (current !== null) {
            if (current.key === key) {
                // 找到键，返回对应的值
                return current.value;
            }
            current = current.next;
        }

        // 键不存在
        return null;
    }

    // 从 HashMap 中获取键对应的值，若键不存在则返回默认值
    public getOrDefault(key: K, defaultValue: V): V {
        const value = this.get(key);
        return value !== null ? value : defaultValue;
    }

    // 从 HashMap 中移除键值对
    public remove(key: K): void {
        const index = this.hash(key);

        // 获取桶中的链表
        let current = this.buckets[index];
        let prev: LinkedListNode<K, V> | null = null;

        // 遍历链表，查找键
        while (current !== null) {
            if (current.key === key) {
                // 键存在，移除节点
                if (prev === null) {
                    this.buckets[index] = current.next; // 删除头节点
                } else {
                    prev.next = current.next; // 删除非头节点
                }
                this.size--;
                return;
            }
            prev = current;
            current = current.next;
        }
    }

    // 将指定键的值与函数的返回值进行合并，若键不存在，则插入新值
    public merge(key: K, value: V, remappingFunction: (oldValue: V | null) => V): void {
        const index = this.hash(key);

        // 获取桶中的链表
        let current = this.buckets[index];
        let prev: LinkedListNode<K, V> | null = null;

        // 遍历链表，查找键
        while (current !== null) {
            if (current.key === key) {
                // 键存在，调用 remappingFunction 更新值
                current.value = remappingFunction(current.value);
                return;
            }
            prev = current;
            current = current.next;
        }

        // 键不存在，调用 remappingFunction 创建新节点
        const newNode = new LinkedListNode(key, remappingFunction(null));
        if (prev === null) {
            this.buckets[index] = newNode; // 链表为空，直接插入
        } else {
            prev.next = newNode; // 链表不为空，在链表尾部插入
        }

        this.size++;

        // 检查是否需要扩容
        if (this.size > this.capacity * HashMap.LOAD_FACTOR) {
            this.resize();
        }
    }

    // 检查 HashMap 是否为空
    public isEmpty(): boolean {
        return this.size === 0;
    }

    // 检查 HashMap 是否非空
    public isNotEmpty(): boolean {
        return this.size > 0;
    }

    // 扩容 HashMap
    private resize(): void {
        const newCapacity = this.capacity * 2;
        const newBuckets: Array<LinkedListNode<K, V> | null> = new Array(newCapacity).fill(null);

        // 将现有元素重新插入新的桶中
        this.buckets.forEach((node) => {
            while (node !== null) {
                const newIndex = this.hash(node.key);
                const newNode = new LinkedListNode(node.key, node.value);
                newNode.next = newBuckets[newIndex];
                newBuckets[newIndex] = newNode;
                node = node.next;
            }
        });

        this.buckets = newBuckets;
        this.capacity = newCapacity;
    }
}
