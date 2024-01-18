// 定义 MvvmConfig 接口
export interface MvvmConfig {
    setFunName: string;
}


// 定义 Mvvm 装饰器
export function mvvm(config: MvvmConfig) {
    return function (target: any,
                     key: string
    ): void {
        let value = target[key];

        // 创建 getter
        const getter = function () {
            return value;
        };

        // 创建 setter
        const setter = function (newValue: any) {
            const oldValue = value;

            // 调用指定的 set 回调函数
            if (config.setFunName && typeof target[config.setFunName] === 'function') {
                target[config.setFunName].call(this, oldValue, newValue);
            }

            value = newValue;
        };

        // 重新定义属性
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}