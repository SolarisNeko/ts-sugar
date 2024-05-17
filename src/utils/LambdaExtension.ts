// 二元操作 | 2个差异对象合并成一个新的对象
export type BiFunction<V1, V2, V> = (value1: V1, value2: V2) => V;

// 提取 key 函数
export type KeyExtractor<T, K> = (item: T) => K;

// 合并函数
export interface MergeFunction<T> {
    (a: T, b: T): T;
}
