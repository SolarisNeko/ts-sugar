// TreeNode 类表示树中的节点
export class TreeNode<K, V> {
    key: K;
    value: V;
    left: TreeNode<K, V> | null = null;
    right: TreeNode<K, V> | null = null;

    constructor(key: K,
                value: V
    ) {
        this.key = key;
        this.value = value;
    }
}

// TreeMap 类表示 TreeMap 数据结构
export class TreeMap<K, V> {
    private root: TreeNode<K, V> | null = null;

    // 向 TreeMap 中插入键值对
    public put(key: K,
               value: V
    ): void {
        this.root = this.insert(this.root, key, value);
    }

    // 从 TreeMap 中获取键对应的值
    public get(key: K): V | null {
        const node = this.search(this.root, key);
        return node ? node.value : null;
    }

    // 从 TreeMap 中移除键值对
    public remove(key: K): void {
        this.root = this.deleteNode(this.root, key);
    }

    // 检查 TreeMap 是否为空
    public isEmpty(): boolean {
        return this.root === null;
    }

    // 辅助方法：插入节点
    private insert(node: TreeNode<K, V> | null,
                   key: K,
                   value: V
    ): TreeNode<K, V> {
        if (node === null) {
            return new TreeNode(key, value);
        }

        // 比较键值大小，决定在左子树还是右子树插入
        if (key < node.key) {
            node.left = this.insert(node.left, key, value);
        } else if (key > node.key) {
            node.right = this.insert(node.right, key, value);
        } else {
            // 如果键已存在，更新值
            node.value = value;
        }

        return node;
    }

    // 辅助方法：查找节点
    private search(node: TreeNode<K, V> | null,
                   key: K
    ): TreeNode<K, V> | null {
        if (node === null || key === node.key) {
            return node;
        }

        // 根据键值大小在左子树或右子树中查找
        if (key < node.key) {
            return this.search(node.left, key);
        } else {
            return this.search(node.right, key);
        }
    }

    // 辅助方法：删除节点
    private deleteNode(node: TreeNode<K, V> | null,
                       key: K
    ): TreeNode<K, V> | null {
        if (node === null) {
            return null;
        }

        // 根据键值大小在左子树或右子树中删除节点
        if (key < node.key) {
            node.left = this.deleteNode(node.left, key);
        } else if (key > node.key) {
            node.right = this.deleteNode(node.right, key);
        } else {
            // 找到要删除的节点

            // 情况1: 节点无左子树或右子树
            if (node.left === null) {
                return node.right;
            } else if (node.right === null) {
                return node.left;
            }

            // 情况2: 节点有左子树和右子树，找到右子树中最小的节点，将其值赋给当前节点
            node.key = this.findMin(node.right).key;
            node.value = this.findMin(node.right).value;

            // 删除右子树中最小节点
            node.right = this.deleteNode(node.right, node.key);
        }

        return node;
    }

    // 辅助方法：找到最小节点
    private findMin(node: TreeNode<K, V>): TreeNode<K, V> {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }
}
