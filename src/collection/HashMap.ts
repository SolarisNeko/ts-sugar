export class LinkedListNode<K, V> {
    key: K;
    value: V;
    next: LinkedListNode<K, V> | null = null;

    constructor(key: K, value: V) {
        this.key = key;
        this.value = value;
    }
}

export class HashMap<K, V> {
    private static readonly DEFAULT_CAPACITY = 16;
    private static readonly LOAD_FACTOR = 0.75;

    private capacity: number;
    private size: number = 0;
    private buckets: Array<LinkedListNode<K, V> | null>;
    private readonly hashFunction: (key: K) => number;

    constructor(capacity: number = HashMap.DEFAULT_CAPACITY) {
        this.capacity = capacity;
        this.buckets = new Array(this.capacity).fill(null);
        this.hashFunction = this.createHashFunction();
    }

    private createHashFunction(): (key: K) => number {
        if (this.capacity <= 0 || !Number.isInteger(this.capacity)) {
            throw new Error("Capacity must be a positive integer.");
        }

        return (key: K) => {
            const hash = String(key).split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
            return (hash & 0x7FFFFFFF) % this.capacity;
        };
    }

    public put(key: K, value: V): void {
        const index = this.hashFunction(key);
        let current = this.buckets[index];
        let prev: LinkedListNode<K, V> | null = null;

        while (current !== null) {
            if (current.key === key) {
                current.value = value;
                return;
            }
            prev = current;
            current = current.next;
        }

        const newNode = new LinkedListNode(key, value);
        if (prev === null) {
            this.buckets[index] = newNode;
        } else {
            prev.next = newNode;
        }

        this.size++;

        if (this.size > this.capacity * HashMap.LOAD_FACTOR) {
            this.resize();
        }
    }

    public get(key: K): V | null {
        const index = this.hashFunction(key);
        let current = this.buckets[index];

        while (current !== null) {
            if (current.key === key) {
                return current.value;
            }
            current = current.next;
        }

        return null;
    }

    public getOrDefault(key: K, defaultValue: V): V {
        const value = this.get(key);
        return value !== null ? value : defaultValue;
    }

    public remove(key: K): void {
        const index = this.hashFunction(key);
        let current = this.buckets[index];
        let prev: LinkedListNode<K, V> | null = null;

        while (current !== null) {
            if (current.key === key) {
                if (prev === null) {
                    this.buckets[index] = current.next;
                } else {
                    prev.next = current.next;
                }
                this.size--;
                return;
            }
            prev = current;
            current = current.next;
        }
    }

    public merge(key: K, value: V, remappingFunction: (oldValue: V, newValue: V) => V): void {
        const index = this.hashFunction(key);
        let current = this.buckets[index];
        let prev: LinkedListNode<K, V> | null = null;

        while (current !== null) {
            if (current.key === key) {
                current.value = remappingFunction(current.value, value);
                return;
            }
            prev = current;
            current = current.next;
        }

        const newNode = new LinkedListNode(key, value);
        if (prev === null) {
            this.buckets[index] = newNode;
        } else {
            prev.next = newNode;
        }

        this.size++;

        if (this.size > this.capacity * HashMap.LOAD_FACTOR) {
            this.resize();
        }
    }

    public isEmpty(): boolean {
        return this.size === 0;
    }

    public isNotEmpty(): boolean {
        return this.size > 0;
    }

    private resize(): void {
        const newCapacity = this.capacity * 2;
        const newBuckets: Array<LinkedListNode<K, V> | null> = new Array(newCapacity).fill(null);
        const oldBuckets = this.buckets;

        this.capacity = newCapacity;
        this.buckets = newBuckets;
        this.size = 0;

        oldBuckets.forEach((node) => {
            while (node !== null) {
                const newIndex = this.hashFunction(node.key);
                const newNode = new LinkedListNode(node.key, node.value);
                newNode.next = newBuckets[newIndex];
                newBuckets[newIndex] = newNode;
                node = node.next;
                this.size++;
            }
        });
    }
}
