import {DataStream} from "../dataStream/DataStream";

export class SetPrototypeExtension {

}

// 全局扩展 Array 原型
declare global {
    interface Set<T> {
        // 转为数据流
        toDataStream(): DataStream<T>;
    }
}

// 为 Array 添加 toDataStream 方法, 转为数据流对象
Set.prototype.toDataStream = function <T>(): DataStream<T> {
    return DataStream.from(this)
};

