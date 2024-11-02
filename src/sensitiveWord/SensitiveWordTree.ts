class TrieNode {
    // 子节点映射
    subMap: Map<string, TrieNode> = new Map<string, TrieNode>();
    // 是否为敏感词结尾
    isEnd: boolean = false;
}

/**
 * 敏感词树
 */
export class SensitiveWordTree {

    // 前缀树根节点
    private root: TrieNode = new TrieNode();

    // 构建前缀树
    build(words: string[]) {
        // 重置前缀树
        this.root = new TrieNode();
        for (const word of words) {
            let node = this.root;
            for (const char of word) {
                if (!node.subMap.has(char)) {
                    node.subMap.set(char, new TrieNode());
                }
                node = node.subMap.get(char)!;
            }
            // 标记单词结尾
            node.isEnd = true;
        }
    }

    // 构建前缀树
    buildByLineText(text: string) {
        const words = (text || "").split('\n');

        this.build(words);
    }

    // 判断字符串中从指定位置开始是否包含敏感词
    isSensitiveWord(text: string, startIndex: number = 0): boolean {
        let node = this.root;
        for (let i = startIndex; i < text.length; i++) {
            const char = text[i];
            node = node.subMap.get(char) || null;
            if (!node) {
                // 没有匹配的路径
                return false;
            }
            if (node.isEnd) {
                // 找到敏感词
                return true;
            }
        }
        return false;
    }

    // 查找文本中的所有敏感词
    getSensitiveWords(text: string): string[] {
        const sensitiveWords: string[] = [];
        for (let i = 0; i < text.length; i++) {
            let node = this.root;
            let j = i;
            while (j < text.length && node.subMap.has(text[j])) {
                node = node.subMap.get(text[j])!;
                j++;
                if (node.isEnd) {
                    // 添加找到的敏感词
                    sensitiveWords.push(text.substring(i, j));
                    break;
                }
            }
        }
        return sensitiveWords;
    }
}
