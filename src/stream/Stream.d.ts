import Stream from "./Stream";


/**
 * 扩展全局 API - 基础数据结构
 */
declare global {
    interface Array<T> {
        stream(): Stream<T>;
    }

    interface Object {
        stream(): Stream<any>;
    }

    interface Map<K, V> {
        stream(): Stream<V>;
    }

    interface Set<T> {
        stream(): Stream<T>;
    }
}

/**
 * 扩展全局
 */
Array.prototype.stream = function () {
    return Stream.from(this);
};

Object.prototype.stream = function () {
    return Stream.from(this);
};

Map.prototype.stream = function () {
    return Stream.from(this);
}
