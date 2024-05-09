// 全局扩展 Map 原型
import {DataStream} from "../dataStream/DataStream";
import {MapEntry} from "../utils/MapUtils";

export class MapPrototypeExtension {

}

declare global {
    interface Map<K, V> {
        // 转为数据流
        toDataStream(): DataStream<MapEntry<K, V>>;
    }
}

// @append 为 Map 添加 toStream 方法, 转为数据流对象
Map.prototype.toDataStream = function <K, V>(): DataStream<MapEntry<K, V>> {
    return DataStream.fromMap(this);
};