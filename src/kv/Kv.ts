export class Kv<K, V> {
    key: K
    value: V
}

export class KvUtils {

    /**
     * 生成 Kv 数组
     * @param data
     */
    static generateKvArrayByMap<K, V>(data: Map<K, V>): Kv<K, V>[] {
        const kvArray = Array<Kv<K, V>>(data.size);
        let count = 0
        for (let obj of data.entries()) {
            let kv = new Kv<K, V>();
            kv.key = obj[0]
            kv.value = obj[1]
            kvArray[count++] = kv
        }
        return kvArray
    }


}