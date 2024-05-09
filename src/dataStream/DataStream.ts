// Lambda
import {Kv, KvUtils} from "../kv/Kv";
import {ObjectUtils} from "../utils/ObjectUtils";


// 转换函数
type ConvertFunction<T, U> = (item: T) => U;

// 判断函数
type PredicateFunc<T> = ConvertFunction<T, boolean>;

type DistinctFunction<T, U> = ConvertFunction<T, U>;


/**
 * 数据流操作工具
 * 给 typescript 提供类似 C# LINQ / Java Stream 风格的数据流式操作
 * 用法:
 * const list = Stream.from([1,2,3,4])
 *  .filter(item => item > 2)
 *  .toList()
 *
 * @author LuoHaoJun
 */
export class DataStream<T> {

    private readonly data: Iterable<T>;

    constructor(data: Iterable<T>) {
        this.data = data;
    }

    /**
     * 创建流 by 数组、Set
     * @param data
     */
    static from<V>(data: V[] | Set<V>): DataStream<V> {
        if (Array.isArray(data)) {
            return new DataStream(data);
        } else if (data instanceof Set) {
            return new DataStream(Array.from(data));
        } else {
            throw new Error(`[Stream] Unsupported data type = ${typeof data}`);
        }
    }

    /**
     * 创建流 by 多个对象
     * @param data
     */
    static of<V>(...data: V[]): DataStream<V> {
        return new DataStream(data);
    }

    /**
     * 创建流 by Map
     * @param data
     */
    static fromMap<K, V>(data: Map<K, V>): DataStream<Kv<K, V>> {
        // entry 就是 T
        const mapEntryArray: Kv<K, V>[] = KvUtils.generateKvArrayByMap(data)
        return new DataStream(mapEntryArray);
    }

    /**
     * 空的流
     */
    static empty() {
        return new DataStream([]);
    }

    /**
     * 合并数据流
     * @param stream
     */
    mergeStream(stream: DataStream<T>): DataStream<T> {
        const self = this
        const mergeIterator = (function* () {
            for (const item of self.data) {
                yield item;
            }
            for (const item of stream.data) {
                yield item;
            }
        })();
        return new DataStream(mergeIterator);
    }

    /**
     * 文本
     */
    toSting(): string {
        return this.toPrintString();
    }


    public toPrintString() {
        if (this.data) {
            // 将迭代器转换为数组
            const dataArray = Array.from(this.data);
            return `Stream[${dataArray.join(",")}]`;
        }
        return "[]";
    }

    /**
     * 去重
     * @param distinctFunction 去重函数, 提取 obj 的某个属性作为 key | null = 直接使用 obj 作为 key
     */
    distinct<U>(distinctFunction: DistinctFunction<T, U> | null = null): DataStream<T> {
        const set = new Set();
        const iterator = (function* () {
            for (const item of this.data) {
                if (distinctFunction) {
                    // 有去重函数
                    const key = distinctFunction(item);
                    if (!set.has(key)) {
                        set.add(key);
                        yield item;
                    }
                } else {
                    // 没有去重函数
                    const key = item;
                    if (!set.has(key)) {
                        set.add(key);
                        yield item;
                    }
                }
            }
        }).bind(this)();
        return new DataStream(iterator);
    };

    /**
     * 比较器进行排序
     * @param comparator 比较两个函数
     */
    sortByComparator(comparator: (a: T, b: T) => number): DataStream<T> {
        const sortedArray = [...this.data]
            .sort((a, b) => {
                return comparator(a, b)
            });
        return new DataStream(sortedArray);
    }

    /**
     *  排序 | 默认从小到大
     * @param objToWeightNumberFunc 将对象转为权重 weight 的函数
     * @param reverse 是否倒序
     */
    sortByWeight(objToWeightNumberFunc: ConvertFunction<T, number> = null,
                 reverse = false
    ): DataStream<T> {
        return new DataStream([...this.data]
            .sort((a, b) => {
                let keyA: number = objToWeightNumberFunc ? objToWeightNumberFunc(a) : 0;
                let keyB: number = objToWeightNumberFunc ? objToWeightNumberFunc(b) : 0;

                // 默认排序
                if (!objToWeightNumberFunc) {
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
     * 倒序牌序
     * @param objToWeightNumberFunc 将对象转为权重 weight 的函数
     */
    sortByWeightReverse(objToWeightNumberFunc: ConvertFunction<T, number> = null): DataStream<T> {
        return this.sortByWeight(objToWeightNumberFunc, true);
    }

    /**
     *  映射 | 将每一个对象转换
     * @param mapFunc 映射函数
     */
    map<U>(mapFunc: ConvertFunction<T, U>): DataStream<U> {
        const iterator = (function* () {
            for (const item of this.data) {
                yield mapFunc(item);
            }
        }).bind(this)();
        return new DataStream(iterator);
    }

    /**
     * 处理每一个对象
     * @param handlerFunction 处理函数
     */
    handle(handlerFunction: (item: T | null) => void): DataStream<T> {
        for (const item of this.data) {
            // 处理每一个对象
            handlerFunction(item)
        }
        return this
    }

    /**
     * 将 dataStream 的每一个元素转换成一个新的 dataStream，然后将这些 dataStream 合并成一个新的 dataStream
     * 例如: [[1,2,3], [4,5]] -> [1,2,3,4,5]
     * @param flatMapFunc 平铺函数
     */
    flatMap<U>(flatMapFunc: ConvertFunction<T, Iterable<U>>): DataStream<U> {
        return new DataStream((function* () {
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
    filter(filterFunction: PredicateFunc<T>): DataStream<T> {
        const filterDataIterator = (function* () {
            for (const item of this.data) {
                if (filterFunction(item)) {
                    yield item;
                }
            }
        }).bind(this)();
        return new DataStream(filterDataIterator);
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
