import { NumberRange } from "../../src/range/NumberRange";

describe('NumberRange', () => {
    test('create method should create a valid range', () => {
        const range = NumberRange.create(1, 100);
        expect(range).toBeInstanceOf(NumberRange);
        expect(range.start).toBe(1);
        expect(range.end).toBe(100);
    });

    test('create method should throw error for invalid range', () => {
        expect(() => {
            NumberRange.create(100, 1);
        }).toThrowError('Invalid range: start must be less than or equal to end');
    });

    test('inIn method should correctly check if a number is in the range', () => {
        const range = NumberRange.create(1, 100);
        expect(range.isIn(50)).toBe(true);
        expect(range.isIn(150)).toBe(false);
    });
});
