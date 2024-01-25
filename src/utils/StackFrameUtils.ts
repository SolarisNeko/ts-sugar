// StackFrameUtils.ts
export class StackFrameLine {
    simpleFileName: string;
    lineNum: string;
    columnNum: string;

    constructor(simpleFileName: string, lineNum: string, columnNum: string) {
        this.simpleFileName = simpleFileName;
        this.lineNum = lineNum;
        this.columnNum = columnNum;
    }

    static empty(): StackFrameLine {
        return new StackFrameLine("", "", "");
    }
}

export class StackFrameUtils {
    static getStackTrace(): StackFrameLine[] {
        const error = new Error();
        const stackLines = (error.stack || '').split('\n').slice(2); // Skip the current and get the remaining stack

        return stackLines.map((line) => {
            const frameInfo = line.match(/(?:at\s+)?(.+?)\s+\((.*?)(?::(\d+))?(?::(\d+))?\)/);

            if (frameInfo) {
                const fullPath = frameInfo[2].replace(/\\/g, '/'); // Replace "\\" with "/"
                const fileName = fullPath.split('/').pop() || ''; // Extract the file name
                const rowNum = frameInfo[3] || '';
                const columnNum = frameInfo[4] ? `:${frameInfo[4]}` : '';

                return new StackFrameLine(fileName, rowNum, columnNum);
            }

            return StackFrameLine.empty();
        });
    }

    static getPreStackFrame(humanNum: number): string | null {
        const num = Math.max(0, humanNum - 1)

        const stackTrace = this.getStackTrace();

        if (stackTrace.length > num) {
            const stackLine = stackTrace[num] || StackFrameLine.empty();
            return `${stackLine.simpleFileName}:${stackLine.lineNum}${stackLine.columnNum}`;
        }

        return null;
    }

    static getLastOneCallStackFrame(): StackFrameLine {
        const stackTrace = this.getStackTrace();

        if (stackTrace.length > 0) {
            return stackTrace[0];
        }

        return StackFrameLine.empty();
    }

    static getLastOneCallStackFrameStr(): string {
        const stackLine = this.getLastOneCallStackFrame();
        return `${stackLine.simpleFileName}:${stackLine.lineNum}${stackLine.columnNum}`;
    }
}
