import {FunctionText} from "../../src/functionText/FunctionText";

describe('FunctionText', () => {
    test('should parse function text correctly', () => {
        const functionText = new FunctionText('${exampleFunction}(key1="value1", key2=123, key3=true)');
        expect(functionText.functionName).toBe('exampleFunction');
        expect(functionText.getString('key1')).toBe('value1');
        expect(functionText.getNumber('key2')).toBe(123);
        expect(functionText.getBoolean('key3')).toBe(true);
    });

    test('should return undefined for non-existing keys', () => {
        const functionText = new FunctionText('${exampleFunction}(key1="value1", key2=123, key3=true)');
        expect(functionText.getString('nonExistingKey')).toBeUndefined();
        expect(functionText.getNumber('nonExistingKey')).toBeUndefined();
        expect(functionText.getBoolean('nonExistingKey')).toBeUndefined();
    });

    test('should return undefined for invalid value types', () => {
        const functionText = new FunctionText('${exampleFunction}(key1="value1", key2="invalidNumber", key3="invalidBoolean")');
        expect(functionText.getNumber('key2')).toBeUndefined();
        expect(functionText.getBoolean('key3')).toBeUndefined();
    });
});
