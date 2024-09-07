import {RedDotTreeBySimple} from "../../src/redDot/RedDotTreeBySimple";

describe('RedDotTree', () => {
    let redDotTree: RedDotTreeBySimple;

    beforeEach(() => {
        redDotTree = new RedDotTreeBySimple();
    });

    it('should add red dots', () => {
        redDotTree.add('/path/to/module1/unit1', 5);
        redDotTree.add('/path/to/module1/unit2', 3);

        expect(redDotTree.get('/path/to/module1')).toBe(8);
    });

    it('should minus red dots', () => {
        redDotTree.add('/path/to/module1/unit1', 5);
        redDotTree.minus('/path/to/module1/unit1', 2);

        expect(redDotTree.get('/path/to/module1')).toBe(3);
    });

    it('should set red dots', () => {
        redDotTree.set('/path/to/module1/unit1', 10);

        expect(redDotTree.get('/path/to/module1/unit1')).toBe(10);
    });

    it('should remove red dots', () => {
        redDotTree.add('/path/to/module1/unit1', 5);
        redDotTree.remove('/path/to/module1/unit1');

        expect(redDotTree.get('/path/to/module1')).toBe(0);
    });

    it('should get total red dots for a prefix', () => {
        redDotTree.add('/path/to/module1/unit1', 5);
        redDotTree.add('/path/to/module1/unit2', 3);
        redDotTree.add('/path/to/module2', 10);

        expect(redDotTree.get('/path/to/module1')).toBe(8);
    });
});
