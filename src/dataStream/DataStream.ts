// Lambda
import { Kv, KvUtils } from "../kv/Kv";
import { ObjectUtils } from "../utils/ObjectUtils";
import { MergeFunction } from "../utils/LambdaExtension";


// 转换函数
type ConvertFunction<T, U> = (item: T) => U;

// 判断函数
type PredicateFunc<T> = ConvertFunction<T, boolean>;

// 去重函数
type DistinctFunction<T, U> = ConvertFunction<T, U>;

// 定义算子接口
interface Operator<T, U> {
    // 对元素应用一个函数
    apply(item: T): U;
}

/**
 * 数据流
 * 1. 参考了 Spark / Flink 思想
 * 2. 给 TypeScript 提供类似 C# LINQ / Java Stream 风格的数据流式操作
 *
 * 用法:
 * const list = DataStream.from([1, 2, 3, 4])
 *  .filter(item => item > 2)
 *  .toList()
 *
 * @autor luohaojun
 */
export class DataStream<T> {
    // 迭代器
    private _dataIterator: Iterable<T>;
    // 算子
    private _operators: Operator<any, any>[] = [];

    private constructor(data: Iterable<T>) {
        this._dataIterator = data;
    }

    /**
     * 创建流 by 数组、Set
     * @param data
     */
    static from<V>(data: V[] | Set<V>): DataStream<V> {
        if (Array.isArray(data)) {
            return DataStream.createNew(data);
        } else if (data instanceof Set) {
            return DataStream.createNew(Array.from(data));
        } else {
            throw new Error(`[Stream] Unsupported data type = ${typeof data}`);
        }
    }

    /**
     * 创建数据流 by 迭代器
     * @param iterator
     */
    static fromIterable<T>(iterator: IterableIterator<T>): DataStream<T> {
        return new DataStream(iterator);
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
        const mapEntryArray: Kv<K, V>[] = KvUtils.generateKvArrayByMap(data);
        return new DataStream(mapEntryArray);
    }

    /**
     * 创建一个新的空白流
     */
    static createNew<T>(array: T[]): DataStream<T> {
        return new DataStream(array);
    }

    // 清空当前实例的操作符和数据迭代器，重置状态以便重用
    private clear(): void {
        this._dataIterator = [];
        this._operators = [];
    }

    /**
     * 合并数据流
     * @param stream
     */
    mergeStream(stream: DataStream<T>): DataStream<T> {
        const mergedArray = [...this.collect0(), ...stream.collect0()];
        return new DataStream(mergedArray);
    }

    /**
     * 文本
     */
    toString(): string {
        return this.toPrintString();
    }

    public toPrintString(): string {
        const dataArray = Array.from(this._dataIterator);
        return `DataStream = [${dataArray.join(",")}]`;
    }

    /**
     * 去重
     * @param distinctFunction 去重函数, 提取 obj 的某个属性作为 key | null = 直接使用 obj 作为 key
     */
    distinct<U>(distinctFunction: DistinctFunction<T, U> | null = null): DataStream<T> {
        const set = new Set<any>();
        this._operators.push({
            apply: (item) => {
                const key = distinctFunction ? distinctFunction(item) : item;
                if (!set.has(key)) {
                    set.add(key);
                    return item;
                }
                return null;
            }
        });
        return this;
    }

    /**
     * 比较器进行排序
     * @param comparator 比较两个函数
     */
    sortByComparator(comparator: (a: T, b: T) => number): DataStream<T> {
        let array = this.collect0().sort(comparator);
        return DataStream.createNew(array);
    }

    /**
     * 权重排序. 默认从小到大
     * @param objToWeightNumberFunc
     * @param reverse
     */
    sortByWeight(objToWeightNumberFunc: ConvertFunction<T, number> = null, reverse = false): DataStream<T> {
        const sortedArray = this.collect0()
            .sort((a, b) => {
                let keyA: number = objToWeightNumberFunc ? objToWeightNumberFunc(a) : 0;
                let keyB: number = objToWeightNumberFunc ? objToWeightNumberFunc(b) : 0;
                if (!objToWeightNumberFunc) {
                    if (ObjectUtils.isNumber(a) && ObjectUtils.isNumber(b)) {
                        keyA = a as number;
                        keyB = b as number;
                    }
                }
                return reverse ? keyB - keyA : keyA - keyB;
            });

        return new DataStream(sortedArray);
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
        this._operators.push({
            apply: (item) => mapFunc(item)
        });
        return this as unknown as DataStream<U>;
    }

    /**
     * 处理每一个对象
     * @param handlerFunction 处理函数
     */
    handle(handlerFunction: (item: T | null) => void): DataStream<T> {
        let array = this.collect0();
        for (let element of array) {
            handlerFunction(element);
        }
        return this;
    }

    // 语法糖
    forEach(handlerFunction: (item: T) => void): DataStream<T> {
        return this.handle(handlerFunction);
    }

    flatMap<U>(flatMapFunc: ConvertFunction<T, Iterable<U>>): DataStream<U> {
        this._operators.push({
            apply: (item) => flatMapFunc(item)
        });
        return this as unknown as DataStream<U>;
    }

    flatMapByDataStream<U>(flatMapFunc: ConvertFunction<T, DataStream<U>>): DataStream<U> {
        this._operators.push({
            apply: (item) => flatMapFunc(item).collect0() as unknown as U
        });
        return this as unknown as DataStream<U>;
    }

    filter(filterFunction: PredicateFunc<T>): DataStream<T> {
        this._operators.push({
            apply: (item) => filterFunction(item) ? item : null
        });
        return this;
    }

    filterNotNull(): DataStream<T> {
        return this.filter(it => it != null);
    }

    reduce<U>(reduceFunc: (reduceValue: U, currentValue: T) => U, initial: U): U {
        let accumulator = initial;
        for (const item of this.collect0()) {
            accumulator = reduceFunc(accumulator, item);
        }
        return accumulator;
    }

    limitInCount(count: number): DataStream<T> {
        let limitedArray = this.collect0().slice(0, count);
        return new DataStream(limitedArray);
    }

    limit(startIndex: number, count: number): DataStream<T> {
        let limitedArray = this.collect0().slice(startIndex, startIndex + count);
        return new DataStream(limitedArray);
    }

    limitInPage(pageNumber: number, pageSize: number): DataStream<T> {
        const pageStartIndex = Math.max(0, pageNumber - 1) * pageSize;
        return this.limit(pageStartIndex, pageSize);
    }

    groupBy<K>(getKeyFunction: ConvertFunction<T, K>): Map<K, T[]> {
        const map = new Map<K, T[]>();
        for (const item of this.collect0()) {
            const key = getKeyFunction(item);
            const group = map.get(key) || [];
            group.push(item);
            map.set(key, group);
        }
        return map;
    }

    first(defaultValue: T | null = null): T | null {
        for (const item of this.collect0()) {
            return item;
        }
        return defaultValue;
    }

    count(): number {
        return this.collect0().length;
    }

    toList(): T[] {
        return this.toArray();
    }

    toArray(): T[] {
        return this.collect0();
    }

    // csv
    toCsvString(): string {
        const array = this.collect0();
        return array.join(",");
    }

    // Map
    toMap<K, V>(keyFunction: ConvertFunction<T, K>,
                valueFunction: ConvertFunction<T, V>,
                mergeFunction: MergeFunction<V> = null
    ): Map<K, V> {
        const map = new Map<K, V>();
        for (const item of this.collect0()) {
            const key = keyFunction(item);
            const value = valueFunction(item);
            const oldValue = map.get(key);
            if (oldValue && mergeFunction) {
                const mergeValue = mergeFunction(oldValue, value);
                map.set(key, mergeValue);
            } else {
                map.set(key, value);
            }
        }
        return map;
    }

    toSet(): Set<T> {
        return new Set(this.collect0());
    }

    maxByWeightNumber(weightExtractFunc: ConvertFunction<T, number>, defaultValue: T = null): T | null {
        let maxVal: T | null = defaultValue;
        for (const item of this.collect0()) {
            if (maxVal === null || weightExtractFunc(item) > weightExtractFunc(maxVal)) {
                maxVal = item;
            }
        }
        return maxVal;
    }

    minByWeightNumber(weightExtractFunc: ConvertFunction<T, number>, defaultValue: T = null): T | null {
        let minVal: T | null = defaultValue;
        for (const item of this.collect0()) {
            if (minVal === null || weightExtractFunc(item) < weightExtractFunc(minVal)) {
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
        for (const item of this.collect0()) {
            if (maxVal === null || comparator(item, maxVal) > 0) {
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
        for (const item of this.collect0()) {
            if (minVal === null || comparator(item, minVal) < 0) {
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

        // 结果
        let array = this.collect0();
        for (let t of array) {
            if (boolFunc(t)) {
                return true;
            }
        }
        return defaultValue;
    }


    /**
     * 收集算子的结果. lazy 计算 + 优化 for 循环 n 层 -> 1 层
     * @private
     */
    private collect0(): T[] {
        let result: T[] = [];
        for (const item of this._dataIterator) {
            let currentItem: T | null = item;
            for (const operator of this._operators) {
                currentItem = operator.apply(currentItem);

                // 算子计算后得到 null, 则剔除元素
                if (currentItem === null) {
                    break;
                }
            }
            if (currentItem != null) {
                result.push(currentItem);
            }
        }

        // 更新数据集
        this._dataIterator = result;
        // 清空算子
        this._operators = [];
        return result;
    }
}
