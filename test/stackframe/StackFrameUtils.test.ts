// StackFrameUtils.test.ts


import {StackFrameUtils} from "../../src/utils/StackFrameUtils";

describe('StackFrameUtils', () => {
    test('getStackTrace should return an array of StackFrameData', () => {
        const stackTrace = StackFrameUtils.getStackTrace();

        console.log(JSON.stringify(stackTrace))

        expect(stackTrace).toBeInstanceOf(Array);
        expect(stackTrace.length).toBeGreaterThan(0);
    });

    test('getPreStackFrame should return the correct pre-stack frame', () => {
        const preStackFrame = StackFrameUtils.getPreStackFrame(1);
        expect(preStackFrame).toBeTruthy();
        // Add more assertions based on your specific logic
    });

    test('getLastOneCallStackFrameStr', () => {
        const stackTrace = StackFrameUtils.getLastOneCallStackFrameStr();
        console.log(JSON.stringify(stackTrace))


        const stackTrace2 = StackFrameUtils.getPreStackFrame(2);
        console.log(JSON.stringify(stackTrace2))


    });
});
