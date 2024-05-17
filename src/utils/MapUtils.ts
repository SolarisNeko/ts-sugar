import {BiFunction, MergeFunction, KeyExtractor} from "./LambdaExtension";

export class MapEntry<K, V> {
    key!: K
    value!: V
}

export class MapUtils {

    static empty<K, V>(): Map<K, V> {
        return new Map();
    }

    public static mergeAll<K, V>(output: Map<K, V>,
                                 biConsumer: BiFunction<V, V>,
                                 ...otherMaps: Map<K, V>[]
    ): Map<K, V> {
        return this.mergeAllByRepeat(
            output,
            biConsumer,
            1,
            ...otherMaps,
        )
    }

    public static mergeAllByRepeat<K, V>(output: Map<K, V>,
                                         biConsumer: BiFunction<V, V>,
                                         repeatCount: number,
                                         ...otherMaps: Map<K, V>[]
    ): Map<K, V> {
        if (repeatCount <= 0 || output == null || biConsumer == null) {
            return output;
        } else {
            for (const kvMap of otherMaps) {
                if (kvMap != null) {
                    for (let i = 0; i < repeatCount; ++i) {
                        kvMap.forEach((value, key) => {
                            if (output.has(key)) {
                                const newVar: V = output.get(key)!;
                                let mergeValue: any = biConsumer(newVar, value);
                                output.set(key, mergeValue);
                            } else {
                                output.set(key, value);
                            }
                        });
                    }
                }
            }

            return output;
        }
    }


    static union<K, V>(...mapArray: Map<K, V>[]): Map<K, V> {
        if (!mapArray) {
            return this.empty();
        } else {
            const kvHashMap = new Map<K, V>();
            for (const kvMap of mapArray) {
                if (kvMap != null) {
                    kvMap.forEach((value, key) => {
                        kvHashMap.set(key, value);
                    });
                }
            }
            return kvHashMap;
        }
    }

    static toLevel1Map<K1, T>(dataList: T[],
                              keyExtractor1: KeyExtractor<T, K1>,
                              mergeFunction: MergeFunction<T>,
    ): Map<K1, T> {
        return dataList == null ? this.empty() : dataList.reduce((map, item) => {
            const key = keyExtractor1(item);
            map.set(key, mergeFunction(map.get(key), item));
            return map;
        }, new Map<K1, T>());
    }

    static toLevel2Map<K1, K2, T>(dataList: T[],
                                  keyExtractor1: KeyExtractor<T, K1>,
                                  keyExtractor2: KeyExtractor<T, K2>,
                                  mergeFunction: MergeFunction<T>,
    ): Map<K1, Map<K2, T>> {
        return dataList == null ? this.empty() : dataList.reduce((map, item) => {
            const key1 = keyExtractor1(item);
            const key2 = keyExtractor2(item);
            const innerMap = map.get(key1) || new Map<K2, T>();
            innerMap.set(key2, mergeFunction(innerMap.get(key2), item));
            map.set(key1, innerMap);
            return map;
        }, new Map<K1, Map<K2, T>>());
    }

    /**
     * 转为 lv.3 Map
     * @param dataList
     * @param keyExtractor1
     * @param keyExtractor2
     * @param keyExtractor3
     * @param mergeFunction
     */
    static toLevel3Map<K1, K2, K3, T>(
        dataList: T[],
        keyExtractor1: KeyExtractor<T, K1>,
        keyExtractor2: KeyExtractor<T, K2>,
        keyExtractor3: KeyExtractor<T, K3>,
        mergeFunction: MergeFunction<T>,
    ): Map<K1, Map<K2, Map<K3, T>>> {
        return dataList == null ? this.empty() : dataList.reduce((map, item) => {
            const key1 = keyExtractor1(item);
            const key2 = keyExtractor2(item);
            const key3 = keyExtractor3(item);
            const innerMap2 = (map.get(key1) || new Map<K2, Map<K3, T>>()).get(key2) || new Map<K3, T>();

            const oldItem: T = innerMap2.get(key3) as T;
            innerMap2.set(key3, mergeFunction(oldItem, item));
            const innerMap1 = map.get(key1) || new Map<K2, Map<K3, T>>();
            innerMap1.set(key2, innerMap2);
            map.set(key1, innerMap1);
            return map;
        }, new Map<K1, Map<K2, Map<K3, T>>>());
    }


    /**
     * 获取指定 key 对应的值，如果不存在则创建并返回默认值
     * @param map 要操作的 Map 对象
     * @param key 要获取或创建的键
     * @param defaultValueCreator 默认值
     * @returns 指定键对应的值
     */
    static getOrCreate<K, V>(map: Map<K, V>, key: K, defaultValueCreator: (() => V)): V {
        if (!map.has(key)) {
            let value = defaultValueCreator();
            map.set(key, value);
        }
        return map.get(key)!;
    }

    /**
     * 合并函数
     * @param map Map
     * @param key key
     * @param value 值
     * @param mergeFunc 合并value函数
     */
    static merge<K, V>(map: Map<K, V>,
                       key: K,
                       value: V,
                       mergeFunc: (v1: V, v2: V) => V,
    ): Map<K, V> {
        if (!map) {
            return map
        }
        if (map.has(key)) {
            const existingValue = map.get(key);
            if (existingValue !== undefined) {
                const mergedValue = mergeFunc(existingValue, value);
                map.set(key, mergedValue);
            }
        } else {
            map.set(key, value);
        }
        return map
    }

    static generateAllMapEntry<K, V>(data: Map<K, V>): MapEntry<K, V>[] {
        const entryList = Array<MapEntry<K, V>>(data.size);
        let count = 0
        for (let obj of data.entries()) {
            let entry = new MapEntry<K, V>();
            entry.key = obj[0]
            entry.value = obj[1]
            entryList[count++] = entry
        }
        return entryList
    }
}