enum LogLevel {
    DEBUG = 0,
    INFO,
    WARN,
    ERROR,
}

/**
 * Logger.error("An error occurred: {0} - {1}", errorMessage, errorCode);
 */
export default class Logger {

    public static isPrintStack: Boolean = false;
    private static logLevel: LogLevel = LogLevel.DEBUG;

    private static getCallLocation(): string {
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

    private static log(level: LogLevel,
                       message: any,
                       ...args: any[]
    ): void {
        if (level >= Logger.logLevel) {
            const logLevelString = ['DEBUG', 'INFO', 'WARN', 'ERROR'][level];
            const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];

            let formattedMessage = message;

            if (typeof message === 'string' && args.length > 0) {
                formattedMessage = message.replace(/{(\d+)}/g,
                    (match,
                     index
                    ) => {
                        const argIndex = parseInt(index, 10);
                        return args[argIndex] !== undefined ? args[argIndex] : match;
                    });
            }

            if (Logger.isPrintStack) {
                const callerInfo = Logger.getCallLocation();
                console.log(`${timestamp} [${logLevelString}] [${callerInfo}] - ${formattedMessage}`);
            } else {
                console.log(`${timestamp} [${logLevelString}] - ${formattedMessage}`);
            }
        }
    }

    static setLevel(level: LogLevel): void {
        Logger.logLevel = level;
    }

    static debug(message: any,
                 ...args: any[]
    ): void {
        Logger.log(LogLevel.DEBUG, message, ...args);
    }

    static info(message: any,
                ...args: any[]
    ): void {
        Logger.log(LogLevel.INFO, message, ...args);
    }

    static warn(message: any,
                ...args: any[]
    ): void {
        Logger.log(LogLevel.WARN, message, ...args);
    }

    static error(message: any,
                 ...args: any[]
    ): void {
        Logger.log(LogLevel.ERROR, message, ...args);
    }
}
