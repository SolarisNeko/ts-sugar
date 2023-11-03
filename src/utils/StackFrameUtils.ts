/**
 * 堆栈工具
 * @author luohaojun
 */
export default class StackFrameUtils {
    /**
     * 获取当前调用栈帧的数组
     */
    static getCallStack(): string[] {
        const stack = new Error().stack;
        if (stack) {
            const stackLines = stack.split('\n');
            return stackLines.slice(2).map((line) => line.trim());
        }
        return [];
    }

    /**
     * 获取当前方法的调用栈帧信息。
     */
    static getCurrentStackFrame(): string {
        const stack = new Error().stack;
        if (stack) {
            const stackLines = stack.split('\n');
            if (stackLines.length >= 3) {
                return stackLines[2].trim();
            }
        }
        return '';
    }

    /**
     * 获取当前方法的调用栈帧信息（这个栈帧之上的调用）。
     */
    static getCurrentMethodStackFrame(): string {
        const stack = new Error().stack;
        if (stack) {
            const stackLines = stack.split('\n');
            if (stackLines.length >= 4) {
                return stackLines[3].trim();
            }
        }
        return '';
    }
}
