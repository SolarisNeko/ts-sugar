import {SensitiveWordTree} from "../../src";

describe('SensitiveWordTree', () => {
    let wordTree: SensitiveWordTree;

    beforeEach(() => {
        wordTree = new SensitiveWordTree();
    });

    test('构建前缀树并检测单个敏感词', () => {
        const words = ['bad', 'ugly', 'offensive'];
        wordTree.build(words);

        expect(wordTree.isSensitiveWord('This is a bad word', 10)).toBe(true);
        expect(wordTree.isSensitiveWord('Such an ugly comment', 8)).toBe(true);
        expect(wordTree.isSensitiveWord('An offensive remark', 3)).toBe(true);
    });

    test('使用 buildByLineText 构建前缀树并检测敏感词', () => {
        const text = 'bad\nugly\noffensive';
        wordTree.buildByLineText(text);

        expect(wordTree.isSensitiveWord('This is a bad word', 10)).toBe(true);
        expect(wordTree.isSensitiveWord('Such an ugly comment', 8)).toBe(true);
        expect(wordTree.isSensitiveWord('An offensive remark', 3)).toBe(true);
    });

    test('找不到敏感词时返回 false', () => {
        const words = ['bad', 'ugly', 'offensive'];
        wordTree.build(words);

        expect(wordTree.isSensitiveWord('This is a good word')).toBe(false);
        expect(wordTree.isSensitiveWord('Such a nice comment')).toBe(false);
    });

    test('获取文本中的所有敏感词', () => {
        const words = ['bad', 'ugly', 'offensive'];
        wordTree.build(words);

        const result = wordTree.getSensitiveWords('This is a bad and ugly statement, quite offensive.');
        expect(result).toEqual(['bad', 'ugly', 'offensive']);
    });

    test('没有敏感词时返回空数组', () => {
        const words = ['bad', 'ugly', 'offensive'];
        wordTree.build(words);

        const result = wordTree.getSensitiveWords('This is a clean statement.');
        expect(result).toEqual([]);
    });
});
