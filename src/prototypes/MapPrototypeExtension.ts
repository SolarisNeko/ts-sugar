// 全局扩展 Map 原型
import {DataStream} from "../dataStream/DataStream";
import {MapEntry} from "../utils/MapUtils";

export class MapPrototypeExtension {
    static init() {
        console.log("MapPrototypeExtension init")
    }
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
         * @param newValueCreator 新的值
         */
        getOrCreate(key: K, newValueCreator: () => V): V

        /**
         * 更新后获得新的 value
         * @param key 键
         * @param initValue 初始值
         * @param updateFunc 更新函数
         */
        updateThenGet(key: K, initValue: V, updateFunc: (oldValue: V) => V): V
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

Map.prototype.getOrCreate = function <K, V>(key: K, newValueCreator: () => V): V {
    let oldValue = this.get(key);
    if (oldValue) {
        return oldValue;
    } else {
        let newValue = newValueCreator();
        this.set(key, newValue);
        return newValue;
    }
}

Map.prototype.updateThenGet = function <K, V>(key: K, initValue: V, updateFunc: (v: V) => V): V {
    let oldValue = this.get(key) || initValue;
    let newValue = updateFunc(oldValue);
    this.set(key, newValue);
    return newValue;

}

MapPrototypeExtension.init()