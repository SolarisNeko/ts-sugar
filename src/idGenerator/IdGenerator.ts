/**
 * ID 生成器
 */
export class IdGenerator {

    /**@private */
    private static _typeToCounterMap: Map<string, number> = new Map();

    /**
     * 获取一个全局唯一ID
     * @param type 类型
     */
    static getNextUID(type: string = "default"): number {
        return IdGenerator._typeToCounterMap.updateThenGet(type, 0, (value) => value + 1)
    }

    static getNextUidString(): string {
        let guid: string = this.getNextUID().toString() + "-";
        for (let i = 1; i <= 32; i++) {
            let n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }
}