// Lambda
import { Kv, KvUtils } from "../kv/Kv";
import { ObjectUtils } from "../utils/ObjectUtils";


// 转换函数
type ConvertFunction<T, U> = (item: T) => U;

// 判断函数
type PredicateFunc<T> = ConvertFunction<T, boolean>;


/**
 * 数据流操作工具
 * 给 typescript 提供类似 C# LINQ / Java Stream 风格的数据流式操作
 * 用法:
 * const list = Stream.from([1,2,3,4])
 *  .filter(item => item > 2)
 *  .toList()
 *
 * @author luohaojun
 */
export class Stream<T> {

    private readonly data: Iterable<T>;

    constructor(data: Iterable<T>) {
        this.data = data;
    }
    
    /**
     * 创建流 by 数组、Set
     * @param data
     */
    static from<V>(data: V[] | Set<V>): Stream<V> {
        if (Array.isArray(data)) {
            return new Stream(data);
        } else if (data instanceof Set) {
            return new Stream(Array.from(data));
        } else {
            throw new Error(`[Stream] Unsupported data type = ${typeof data}`);
        }
    }

    /**
     * 创建流 by Map
     * @param data
     */
    static fromMap<K, V>(data: Map<K, V>): Stream<Kv<K, V>> {
        // entry 就是 T
        const mapEntryArray: Kv<K, V>[] = KvUtils.generateKvArrayByMap(data)
        return new Stream(mapEntryArray);
    }


    /**
     *  排序
     * @param toSortNumFunc 排序函数，返回数字，默认按照数字排序
     * @param reverse 是否倒序
     */
    sort(toSortNumFunc: ConvertFunction<T, number> | null = null,
         reverse = false
    ): Stream<T> {
        return new Stream([...this.data]
            .sort((a, b) => {
                let keyA: number = toSortNumFunc ? toSortNumFunc(a) : 0;
                let keyB: number = toSortNumFunc ? toSortNumFunc(b) : 0;

                // 默认排序
                if (!toSortNumFunc) {
                    if (ObjectUtils.isNumber(a)
                        && ObjectUtils.isNumber(b)
                    ) {
                        keyA = a as number;
                        keyB = b as number;
                    }
                }
                return reverse ? keyB - keyA : keyA - keyB;
            }));
    }

    /**
     *  映射 | 将每一个对象转换
     * @param mapFunc 映射函数
     */
    map<U>(mapFunc: ConvertFunction<T, U>): Stream<U> {
        const iterator = (function* () {
            for (const item of this.data) {
                yield mapFunc(item);
            }
        }).bind(this)();
        return new Stream(iterator);
    }

    /**
     * 将 stream 的每一个元素转换成一个新的 stream，然后将这些 stream 合并成一个新的 stream
     * 例如: [[1,2,3], [4,5]] -> [1,2,3,4,5]
     * @param flatMapFunc 平铺函数
     */
    flatMap<U>(flatMapFunc: ConvertFunction<T, Iterable<U>>): Stream<U> {
        return new Stream((function* () {
            for (const sublist of this.data) {
                for (const item of flatMapFunc(sublist)) {
                    yield item;
                }
            }
        }).bind(this)());
    }

    /**
     * 过滤函数
     * @param filterFunction 过滤函数 true = 保留, false = 剔除
     */
    filter(filterFunction: PredicateFunc<T>): Stream<T> {
        const filterDataIterator = (function* () {
            for (const item of this.data) {
                if (filterFunction(item)) {
                    yield item;
                }
            }
        }).bind(this)();
        return new Stream(filterDataIterator);
    }

    /**
     * 聚合函数
     * @param reduceFunc 将2个元素聚合成1个
     * @param initial 初始合并元素
     */
    reduce<U>(reduceFunc: (reduceValue: U,
                           currentValue: T
              ) => U,
              initial: U
    ): U {
        let accumulator = initial;
        for (const item of this.data) {
            accumulator = reduceFunc(accumulator, item);
        }
        return accumulator;
    }

    /**
     *  分组函数
     * @param getKeyFunction 键函数
     */
    groupBy<K>(getKeyFunction: ConvertFunction<T, K>): Map<K, T[]> {
        const map = new Map<K, T[]>()
        for (const item of this.data) {
            const key: K = getKeyFunction(item);

            const isHasKey = map.has(key);
            let valueArray = map.get(key)
            if (!isHasKey) {
                map.set(key, []);
                valueArray = map.get(key)
            }
            valueArray.push(item);
        }
        return map;
    }

    /**
     * 第一个元素
     */
    first(): T | null {
        for (const item of this.data) {
            return item;
        }
        return null;
    }

    /**
     * 数量
     */
    count(): number {
        let count = 0;
        for (const _ of this.data) {
            count++;
        }
        return count;
    }

    /**
     * 转为数组
     */
    toList(): T[] {
        return [...this.data];
    }

    /**
     * 转为数组
     */
    toArray(): T[] {
        return this.toList()
    }

    /**
     * 转为字典
     * @param keyFunction
     * @param valueFunction
     */
    toMap<K, V>(keyFunction: ConvertFunction<T, K>,
                valueFunction: ConvertFunction<T, V>
    ): Map<K, V> {
        const map1 = new Map<K, V>();
        for (const item of this.data) {
            const key: K = keyFunction(item);
            const value: V = valueFunction(item);
            map1.set(key, value);
        }
        return map1;
    }

    /**
     * 转为 Set
     */
    toSet(): Set<T> {
        return new Set(this.toList());
    }

    /**
     * 最大
     * @param compareFunc 比较函数 | 根据 item 生成权重值
     */
    max(compareFunc: ConvertFunction<T, number>): T | null {
        let maxVal: T | null = null;
        for (const item of this.data) {
            if (maxVal === null || compareFunc(item) > compareFunc(maxVal)) {
                maxVal = item;
            }
        }
        return maxVal;
    }

    /**
     * 最小
     * @param compareFunc  比较函数 | 根据 item 生成权重值
     */
    min(compareFunc: ConvertFunction<T, number>): T | null {
        let minVal: T | null = null;
        for (const item of this.data) {
            if (minVal === null || compareFunc(item) < compareFunc(minVal)) {
                minVal = item;
            }
        }
        return minVal;
    }
}

