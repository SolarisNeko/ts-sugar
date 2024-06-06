// Lambda
import {Kv, KvUtils} from "../kv/Kv";
import {ObjectUtils} from "../utils/ObjectUtils";
import {MergeFunction} from "../utils/LambdaExtension";


// 转换函数
type ConvertFunction<T, U> = (item: T) => U;

// 判断函数
type PredicateFunc<T> = ConvertFunction<T, boolean>;

// 去重函数
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


    public toPrintString(): string {
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
        const sortedArray = Array.from(this.dataIterator).sort(comparator);
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
        const newArray: T[] = Array.from(this.dataIterator)
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
            })
        return new DataStream(newArray);
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
        let array = new Array<U>();
        for (const item of this.dataIterator) {
            const newItem = mapFunc(item);
            array.push(newItem)
        }
        return new DataStream(array);
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

    // 语法糖
    forEach(handlerFunction: (item: T) => void): DataStream<T> {
        this.handle(handlerFunction)
        return this;
    }

    /**
     * 将 stream 的每一个元素转换成一个新的 stream，然后将这些 stream 合并成一个新的 stream
     * 例如: [[1,2,3], [4,5]] -> [1,2,3,4,5]
     * @param flatMapFunc 平铺成 Array/Set 的函数 | 将 obj 转为 Array[]
     */
    flatMap<U>(flatMapFunc: ConvertFunction<T, Iterable<U>>): DataStream<U> {
        const flatMapArray = new Array<U>()
        for (const sublist of this.dataIterator) {
            const subArray = flatMapFunc(sublist);
            for (const item of subArray) {
                flatMapArray.push(item);
            }
        }
        return DataStream.from(flatMapArray)
    }

    /**
     * 通过转为 DataStream 来进行平铺 DataStream 内部的所有元素
     * @param flatMapFunc 平铺成 DataStream 的函数
     */
    flatMapByDataStream<U>(flatMapFunc: ConvertFunction<T, DataStream<U>>): DataStream<U> {
        const flatMapArray = new Array<U>()
        for (const sublist of this.dataIterator) {
            const subArray = flatMapFunc(sublist);
            if (!subArray) {
                continue
            }
            subArray.handle(it => {
                flatMapArray.push(it);
            })
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
     * 过滤非空
     */
    filterNotNull(): DataStream<T> {
        return this.filter(it => it != null)
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

    // 限制数量 | 取前 count 个元素
    limitInCount(count: number): DataStream<T> {
        const limitArray = new Array<T>();
        let index = 0;
        for (const item of this.dataIterator) {
            if (index >= count) {
                break;
            }
            limitArray.push(item);
            index++;
        }
        return DataStream.from(limitArray);
    }

    /**
     * 类似 SQL 的 limit 语法
     * @param startIndex
     * @param count
     */
    limit(startIndex: number, count: number) {
        const limitArray = new Array<T>();
        let index = 0;
        for (const item of this.dataIterator) {
            // 取范围内
            if (index >= startIndex && index < startIndex + count) {
                limitArray.push(item);
            }
            index++;
        }
        return DataStream.from(limitArray);
    }

    /**
     * 分页过滤数量
     * @param pageNumber
     * @param pageSize
     */
    limitInPage(pageNumber: number, pageSize: number) {
        const pageStartIndex = Math.max(0, pageNumber - 1);
        const startIndex = pageStartIndex * pageSize;
        return this.limit(startIndex, pageSize);
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
     * @param weightExtractFunc 比较函数 | 根据 item 生成权重值
     * @param defaultValue
     */
    maxByWeightNumber(weightExtractFunc: ConvertFunction<T, number>, defaultValue: T = null): T | null {
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
            if (weightExtractFunc(item) > weightExtractFunc(maxVal)) {
                maxVal = item;
            }
        }
        return maxVal;
    }

    /**
     * 最小
     * @param weightExtractFunc  比较函数 | 根据 item 生成权重值
     * @param defaultValue
     */
    minByWeightNumber(weightExtractFunc: ConvertFunction<T, number>,
                      defaultValue: T = null
    ): T | null {
        let minVal: T | null = defaultValue;
        for (const item of this.dataIterator) {
            if (minVal === null) {
                minVal = item
                continue
            }
            if (item == null) {
                continue
            }
            if (weightExtractFunc(item) < weightExtractFunc(minVal)) {
                minVal = item;
            }
        }
        return minVal;
    }

    /**
     * 最大, 通过比较器函数
     * @param comparator 比较函数 | 返回 1 表示 item1 大, 返回 -1 表示 item2 大, 返回 0 表示相等
     * @param defaultValue
     */
    maxByComparator(comparator: (item1: T, item2: T) => number, defaultValue: T = null): T | null {
        let maxVal: T | null = defaultValue;
        for (const item of this.dataIterator) {
            if (maxVal === null) {
                maxVal = item;
                continue;
            }
            if (item == null) {
                continue;
            }
            // 比较
            const compareResult = comparator(item, maxVal);
            if (compareResult > 0) {
                maxVal = item;
            }
        }
        return maxVal;
    }

    /**
     * 最小, 通过比较器函数
     * @param comparator 比较函数 | 返回 1 表示 item1 大, 返回 -1 表示 item2 大, 返回 0 表示相等
     * @param defaultValue
     */
    minByComparator(comparator: (item1: T, item2: T) => number, defaultValue: T = null): T | null {
        let minVal: T | null = defaultValue;
        for (const item of this.dataIterator) {
            if (minVal === null) {
                minVal = item;
                continue;
            }
            if (item == null) {
                continue;
            }
            const compareResult = comparator(item, minVal);
            if (compareResult < 0) {
                minVal = item;
            }
        }
        return minVal;
    }


    /**
     * 是否存在
     * @param boolFunc
     * @param defaultValue
     */
    check(boolFunc: PredicateFunc<T>, defaultValue: boolean = false): boolean {
        if (!boolFunc) {
            return defaultValue;
        }
        for (const item of this.dataIterator) {
            if (boolFunc(item)) {
                return true;
            }
        }
        return defaultValue;
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
