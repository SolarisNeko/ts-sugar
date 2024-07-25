// 全局扩展 Array 原型
import {DataStream} from "../dataStream/DataStream";

export class ArrayExtension {

}

declare global {
    interface Array<T> {
        // 转为数据流
        toDataStream(): DataStream<T>;
    }
}

// 为 Array 添加 toDataStream 方法, 转为数据流对象
Array.prototype.toDataStream = function <T>(): DataStream<T> {
    return DataStream.from(this)
};

