import {StackFrameUtils} from "../utils/StackFrameUtils";
import {DateTimeUtils} from "../time/DateTimeUtils";

// 日志级别
export enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
}

// Logger 配置选项接口
export class LoggerOptions {
    // 前几行堆栈信息
    preStackLineNum: number = 3
    // 日志级别
    level: LogLevel = LogLevel.DEBUG
    // 日志颜色
    color: string = LogColor.None
}


// Logger 颜色枚举
export enum LogColor {
    None = '',
    Green = 'color:green;',
    Red = 'color:red;',
    Grey = 'color:grey;',
    Orange = 'color:#ee7700;',
    Violet = 'color:Violet;',
    Blue = 'color:#3a5fcd;',
}

/**
 * Logger 类，用于记录日志。
 */
export class Logger {

    // 默认日志器
    public static readonly DEFAULT = new Logger(
        "default",
        Object.assign(new LoggerOptions(), {
            preStackLineNum: 4,
        }),
    );

    // 日志分类
    private readonly loggerName: string;
    // 日志级别
    private _level: LogLevel = LogLevel.DEBUG;
    // 日志颜色
    private readonly _color: string;
    private readonly _preStackLineNum: number;
    // 配置选项
    private readonly _options: LoggerOptions;


    /**
     * 创建 Logger 实例。
     * @param loggerName 日志分类
     * @param options 配置选项
     */
    constructor(loggerName: string,
                options: LoggerOptions = new LoggerOptions(),
    ) {
        this.loggerName = loggerName;
        this._options = options;

        this._preStackLineNum = options.preStackLineNum || 3;
        this._level = options.level;
        this._color = options.color;
    }

    public get logLevel(): LogLevel {
        return this._level
    }

    public setLogLevel(level: LogLevel) {
        let oldLevel = this._level;
        Logger.DEFAULT.info(`logger name = ${this.loggerName}, level change! old level = ${oldLevel}, new level = ${level}`, this)
        this._level = level;
    }

    private getCallLocation(): string {
        const stack = new Error().stack;

        function getSimpleFileName(fileName: string) {
            let number = fileName.lastIndexOf("\\");
            if (!number) {
                number = fileName.indexOf("/")
            }
            // 如果还是找不到 simple fileName, 就直接返回
            if (!number) {
                return fileName
            }
            // 只返回 simple fileName
            return `${fileName.substring(number + 1)}`;
        }

        if (stack) {
            const stackLines = stack.split('\n');
            // 调用栈的第三行通常是调用此方法的位置
            if (stackLines.length >= 3) {
                const callSite = stackLines[2].trim();
                const locationMatches = callSite.match(/\((.*):(\d+):\d+\)/);
                if (locationMatches && locationMatches.length > 2) {
                    const fileName = locationMatches[1].split('/').pop() || ''; // 获取文件名
                    const lineNumber = locationMatches[2]; // 获取行号

                    let simpleFileName = getSimpleFileName(fileName)
                    return `${simpleFileName}:${lineNumber}`;
                }
            }
        }
        return '';
    }

    private log0(level: LogLevel,
                 message: string,
                 ...args: any[]
    ): void {
        if (level < this._level) {
            // 不记录低于日志级别的日志
            return;
        }

        let colorStyle: string = this._color;
        let dateTimeText = DateTimeUtils.getCurrentDateTimeText();
        // 获取前 N 行调用栈信息
        const callLine = StackFrameUtils.getPreStackFrame(this._preStackLineNum);

        // 日志格式化
        const levelName = LogLevel[level];
        let logMessage = `%c${dateTimeText} | ${this.loggerName} | ${levelName} | ${callLine} - ${message}`;

        switch (level) {
            case LogLevel.DEBUG:
                console.debug(logMessage, colorStyle, ...args);
                break;
            case LogLevel.INFO:
                console.log(logMessage, colorStyle, ...args);
                break;
            case LogLevel.WARN:
                console.warn(logMessage, colorStyle, ...args);
                break;
            case LogLevel.ERROR:
                console.error(logMessage, colorStyle, ...args);
                break;
        }
    }


    /**
     * 调试级别日志。
     * @param message 日志消息
     * @param args 其他参数
     */
    debug(message: string,
          ...args: any[]
    ): void {
        this.log0(LogLevel.DEBUG, message, ...args);
    }

    /**
     * 信息级别日志。
     * @param message 日志消息
     * @param args 其他参数
     */
    info(message: string,
         ...args: any[]
    ): void {
        this.log0(LogLevel.INFO, message, ...args);
    }

    /**
     * 警告级别日志。
     * @param message 日志消息
     * @param args 其他参数
     */
    warn(message: string,
         ...args: any[]
    ): void {
        this.log0(LogLevel.WARN, message, ...args);
    }

    /**
     * 错误级别日志。
     * @param message 日志消息
     * @param args 其他参数
     */
    error(message: string,
          ...args: any[]
    ): void {
        this.log0(LogLevel.ERROR, message, ...args);
    }
}

/**
 * LoggerFactory 类，用于创建 Logger 实例。
 */
export class LoggerFactory {
    /**
     * 获取 Logger 实例。
     * @param loggerName 日志分类
     * @param options 配置选项
     * @returns Logger 实例
     */
    static getLogger(loggerName: string,
                     options: LoggerOptions = new LoggerOptions(),
    ): Logger {
        return new Logger(loggerName, options);
    }
}