/**
 * Lambda 函数通用接口
 */
export namespace LambdaApi233 {

    /**
     * 消费函数
     */
    export type Consumer<T> = (value: T) => void;


    /**
     * 判断函数
     */
    export type Predicate<T> = (value: T) => void;


    /**
     * 合并函数
     */
    export type MergeFunction<T> = (value1: T, value2: T) => T;
}