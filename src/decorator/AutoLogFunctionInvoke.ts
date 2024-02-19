/**
 * @AutoLogFunctionInvoke
 * 自动记录函数的调用前后. 入参 + 返回值
 *
 * @param target 目标对象
 * @param key 函数名
 * @param descriptor 函数
 */
export function AutoLogFunctionInvoke(target: any, key: string, descriptor: PropertyDescriptor) {

    const originalMethod = descriptor.value;
    const className = target.constructor.name; // 获取类名


    descriptor.value = function (...args: any[]) {
        // 获取函数名称
        const functionName = key;

        // 获取参数值
        const params = JSON.stringify(args);

        // 调用原始函数并获取返回值
        const result = originalMethod.apply(this, args);

        // 获取返回值
        const returnValue = JSON.stringify(result);

        // 打印日志
        console.log(`Class: ${className}, Function: ${functionName}, Parameters: ${params}, Return Value: ${returnValue}`);

        return result;
    };

    return descriptor;
}
