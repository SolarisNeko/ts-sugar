// Lambda
import {Kv, KvUtils} from "../kv/Kv";
import {ObjectUtils} from "../utils/ObjectUtils";
import {BiFunction, MergeFunction} from "../utils/LambdaExtension";


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
 * @author luohaojun
 */
export class DataStream<T> {

    private readonly dataIterator: Iterable<T>;

    private constructor(data: Iterable<T>) {
        this.dataIterator = data;
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
     * 创建数据流 by 迭代器
     * @param iterator
     */
    static fromIterable<T>(iterator: IterableIterator<T>): DataStream<T> {
        return new DataStream(iterator)
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
     * 创建一个新的空白流
     */
    static createNew<T>(): DataStream<T> {
        return new DataStream([]);
    }

    /**
     * 合并数据流
     * @param stream
     */
    mergeStream(stream: DataStream<T>): DataStream<T> {
        const self = this
        const array = new Array<T>();
        for (const item of self.dataIterator) {
            array.push(item);
        }
        for (const item of stream.dataIterator) {
            array.push(item);
        }
        return new DataStream(array);
    }

    /**
     * 文本
     */
    toSting(): string {
        return this.toPrintString();
    }


    public toPrintString() {
        if (this.dataIterator) {
            // 将迭代器转换为数组
            const dataArray = Array.from(this.dataIterator);
            return `Stream[${dataArray.join(",")}]`;
        }
        return "[]";
    }

    /**
     * 去重
     * @param distinctFunction 去重函数, 提取 obj 的某个属性作为 key | null = 直接使用 obj 作为 key
     */
    distinct<U>(distinctFunction: DistinctFunction<T, U> | null = null): DataStream<T> {
        const outputArray = new Array<T>();

        const set = new Set<any>();
        for (const item of this.dataIterator) {
            if (distinctFunction) {
                // 有去重函数
                const key = distinctFunction(item);
                if (!set.has(key)) {
                    set.add(key);
                    outputArray.push(item)
                }
            } else {
                // 没有去重函数
                const key = item;
                if (!set.has(key)) {
                    set.add(key);
                    outputArray.push(item)
                }
            }
        }
        return DataStream.from(outputArray);
    };

    /**
     * 比较器进行排序
     * @param comparator 比较两个函数
     */
    sortByComparator(comparator: (a: T, b: T) => number): DataStream<T> {
        const sortedArray = [...this.dataIterator]
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
        return new DataStream([...this.dataIterator]
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
            for (const item of this.dataIterator) {
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
        for (const item of this.dataIterator) {
            // 处理每一个对象
            handlerFunction(item)
        }
        return this
    }

    /**
     * 将 stream 的每一个元素转换成一个新的 stream，然后将这些 stream 合并成一个新的 stream
     * 例如: [[1,2,3], [4,5]] -> [1,2,3,4,5]
     * @param flatMapFunc 平铺函数
     */
    flatMap<U>(flatMapFunc: ConvertFunction<T, Iterable<U>>): DataStream<U> {
        const flatMapArray = new Array<U>()
        for (const sublist of this.dataIterator) {
            for (const item of flatMapFunc(sublist)) {
                flatMapArray.push(item);
            }
        }
        return DataStream.from(flatMapArray)
    }

    /**
     * 过滤函数
     * @param filterFunction 过滤函数 true = 保留, false = 剔除
     */
    filter(filterFunction: PredicateFunc<T>): DataStream<T> {
        const filterArray = new Array<T>();
        for (const item of this.dataIterator) {
            if (filterFunction(item)) {
                filterArray.push(item)
            }
        }
        return DataStream.from(filterArray);
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
        for (const item of this.dataIterator) {
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
        for (const item of this.dataIterator) {
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
     * @param defaultValue 找不到时的默认值
     */
    first(defaultValue: T | null = null): T | null {
        if (!this.dataIterator) {
            return defaultValue;
        }
        for (const item of this.dataIterator) {
            return item;
        }
        return defaultValue;
    }

    /**
     * 数量
     */
    count(): number {
        let count = 0;
        for (const _ of this.dataIterator) {
            count++;
        }
        return count;
    }

    /**
     * 转为数组
     */
    toList(): T[] {
        // slice() 方法用于复制数组
        return Array.from(this.dataIterator);
    }

    /**
     * 转为数组
     */
    toArray(): T[] {
        return this.toList()
    }

    /**
     * 转为字典
     * @param keyFunction 获取 key
     * @param valueFunction 获取 value
     * @param mergeFunction 如果 key 冲突的合并函数 | null = 覆盖
     */
    toMap<K, V>(keyFunction: ConvertFunction<T, K>,
                valueFunction: ConvertFunction<T, V>,
                mergeFunction: MergeFunction<V> = null
    ): Map<K, V> {
        const map1 = new Map<K, V>();
        for (const item of this.dataIterator) {
            const key: K = keyFunction(item);
            const value: V = valueFunction(item);
            const oldValue = map1.get(key);
            if (oldValue) {
                if (mergeFunction) {
                    const mergeValue = mergeFunction(oldValue, value);
                    map1.set(key, mergeValue);
                } else {
                    map1.set(key, value);
                }
            } else {
                map1.set(key, value);
            }
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
     * @param defaultValue
     */
    max(compareFunc: ConvertFunction<T, number>, defaultValue: T = null): T | null {
        let maxVal: T | null = defaultValue;
        for (const item of this.dataIterator) {
            if (maxVal === null) {
                maxVal = item
                continue
            }
            if (item == null) {
                continue
            }
            // 比较
            if (compareFunc(item) > compareFunc(maxVal)) {
                maxVal = item;
            }
        }
        return maxVal;
    }

    /**
     * 最小
     * @param compareFunc  比较函数 | 根据 item 生成权重值
     * @param defaultValue
     */
    min(compareFunc: ConvertFunction<T, number>, defaultValue: T = null): T | null {
        let minVal: T | null = defaultValue;
        for (const item of this.dataIterator) {
            if (minVal === null) {
                minVal = item
                continue
            }
            if (item == null) {
                continue
            }
            if (compareFunc(item) < compareFunc(minVal)) {
                minVal = item;
            }
        }
        return minVal;
    }

    /**
     * 合并其他数据
     * @param otherArray
     */
    mergeData(otherArray: T[] | Set<T>): DataStream<T> {
        const otherStream = DataStream.from(otherArray);
        return this.mergeStream(otherStream)
    }

}
