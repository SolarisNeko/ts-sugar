export type BiFunction<K, V> = (value1: V, value2: V) => V;

export type KeyExtractor<T, K> = (item: T) => K;

export interface BinaryOperator<T> {
    (a: T, b: T): T;
}
