// 全局扩展 Map 原型
import {DataStream} from "../dataStream/DataStream";
import {MapEntry} from "../utils/MapUtils";

export class MapPrototypeExtension {

}

// 全局扩展 Map 原型
declare global {
    interface Map<K, V> {
        // 转为数据流
        toDataStream(): DataStream<MapEntry<K, V>>;

        /**
         * 合并
         * @param key key
         * @param value 值
         * @param mergeFunc 如果原本就有值 v1, 则新放入的值作为 v2 进行合并处理
         */
        merge(key: K, value: V, mergeFunc: (v1: V, v2: V) => V): V

        /**
         * 获取/创建
         * @param key
         * @param newValue 新的值
         */
        getOrCreate(key: K, newValue: V): V
    }
}

// @append 为 Map 添加 toStream 方法, 转为数据流对象
Map.prototype.toDataStream = function <K, V>(): DataStream<MapEntry<K, V>> {
    return DataStream.fromMap(this);
};

// 合并 value
Map.prototype.merge = function <K, V>(key: K, value: V, mergeFunc: (v1: V, v2: V) => V): V {
    let oldValue = this.get(key);
    if (oldValue === undefined) {
        this.set(key, value);
        return value;

    } else {
        let newValue = mergeFunc(oldValue, value);
        this.set(key, newValue);
        return newValue;
    }
};

Map.prototype.getOrCreate = function <K, V>(key: K, newValue: V): V {
    let oldValue = this.get(key);
    if (oldValue) {
        return oldValue;
    } else {
        this.set(key, newValue);
        return newValue;
    }
}