/**
 * 函数文本
 */
export class FunctionText {
    functionName: string = '';
    kvMap: Map<string, any> = new Map<string, any>();

    constructor(input: string) {
        const regex = /(\w+)\(([^)]*)\)/;
        const match = input.match(regex);

        if (match) {
            this.functionName = match[1];
            const keyValuePairs = match[2].split(',').map(pair => pair.trim());

            keyValuePairs.forEach(pair => {
                const [key, value] = pair.split('=')
                    .map(item => item.trim());

                if (value.startsWith('"') && value.endsWith('"')) {
                    this.kvMap.set(key, value.slice(1, -1));
                } else if (value === 'true' || value === 'false') {
                    this.kvMap.set(key, value === 'true');
                } else if (!isNaN(parseFloat(value))) {
                    this.kvMap.set(key, parseFloat(value));
                } else {
                    this.kvMap.set(key, value);
                }
            });
        }
    }

    getString(key: string): string | undefined {
        const value = this.kvMap.get(key);
        return typeof value === 'string' ? value : undefined;
    }

    getBoolean(key: string): boolean | undefined {
        const value = this.kvMap.get(key);
        return typeof value === 'boolean' ? value : undefined;
    }

    getNumber(key: string): number | undefined {
        const value = this.kvMap.get(key);
        return typeof value === 'number' ? value : undefined;
    }
}
