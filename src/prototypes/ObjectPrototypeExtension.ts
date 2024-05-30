// 全局扩展 Object 原型

export class ObjectPrototypeExtension {

}

// 声明 global 范围内的接口扩展
declare global {
    interface Object {
        // 处理自己
        apply<T>(this: T, lambda: (self: T) => void): T;

        // 应用数据到自己身上
        applyData<T>(this: T, data: T): T;
    }
}

// 为 Object 添加 apply 方法，实现类似 Kotlin 的 .apply {}
Object.prototype.apply = function <T>(this: T, lambda: (self: T) => void): T {
    // 绑定 this 指针
    let selfFunc = lambda.bind(this);
    selfFunc(this);
    return this;
}

// 为 Object 添加 apply 方法，实现类似 Kotlin 的 .apply {}
Object.prototype.applyData = function <T>(this: T, data: T): T {
    Object.assign(this, data)
    return this;
}