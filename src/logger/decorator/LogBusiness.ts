import {DateTimeUtils} from "../../time/DateTimeUtils";

export class LogBusinessOptions {
    // 业务调用消息
    businessTitle: string = "";

    // 是否吞掉异常
    swallowErrorFlag: boolean = false;

    private static readonly DEFAULT_OPTIONS = new LogBusinessOptions();

    /**
     * 获取默认配置
     */
    static empty(): LogBusinessOptions {
        return LogBusinessOptions.DEFAULT_OPTIONS;
    }

    /**
     * 创建新的配置
     */
    static createNew(): LogBusinessOptions {
        return new LogBusinessOptions();
    }

    /**
     * 创建配置
     * @param args
     */
    static create(args: {
        businessTitle: string
        swallowErrorFlag: boolean
    }): LogBusinessOptions {
        const options = new LogBusinessOptions();
        options.businessTitle = args.businessTitle;
        options.swallowErrorFlag = args.swallowErrorFlag;
        return options;
    }
}

/**
 * 高性能记录业务日志的装饰器
 * 1. 高性能, 减少栈帧
 * 2. 自动记录调用参数和返回值
 *
 * @decorator @LogBusiness
 * @param options 配置
 * @constructor
 */
export function LogBusiness(options: LogBusinessOptions = LogBusinessOptions.empty()) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const className = target?.constructor?.name || "null";
        const methodName = propertyKey || "null";

        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const dateTimeStr = DateTimeUtils.getCurrentDateTimeText("yyyy-MM-dd HH:mm:ss,SSS")

            // // Get the stack trace
            // const stackTrace = new Error().stack;
            // const stackArray = stackTrace.split("\n");
            // let className = "null";
            // let methodName = "null";
            //
            // if (stackArray && stackArray.length > 3) {
            //     const callMethodLine = stackArray[2];
            //     const classCallMethodName = stackArray[2].trim().split(' ')[1];
            //     if (classCallMethodName) {
            //         const classToMethodNameSplit = classCallMethodName.split(".");
            //
            //         className = classToMethodNameSplit[0];
            //         methodName = classToMethodNameSplit[1];
            //     }
            // }

            const businessTitle = options.businessTitle || "";
            try {
                console.log(`[${dateTimeStr}] [${className}.${methodName}] ${businessTitle} | @LogBusiness | call args:`, args);
                const result = originalMethod.apply(this, args);

                // return void
                if (result === undefined) {
                    console.log(`[${dateTimeStr}] [${className}.${methodName}] ${businessTitle} | @LogBusiness | no return value`);
                } else {
                    console.log(`[${dateTimeStr}] [${className}.${methodName}] ${businessTitle} | @LogBusiness | return value:`, result);
                }

                return result;
            } catch (error) {

                // cocos 捕捉异常会丢失正确的栈帧, 故改称这样捕获能够极快定位问题
                console.error(`[${dateTimeStr}] [${className}.${methodName}] ${businessTitle} | @LogBusiness | unknown error:`, error);

                // 继续抛出异常
                throw error;
            }
        };
    };
}