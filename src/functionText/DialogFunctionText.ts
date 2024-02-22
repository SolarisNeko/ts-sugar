import {FunctionText} from './FunctionText';

/**
 * 聊天函数文本
 * 格式 =  [${functionName}(args... key=value 结构)]  ${textContent}
 * 格式中的 ${} 为占位符，不需要考虑 ${ } 这三个字符
 */
export class DialogFunctionText {
    functionText: FunctionText;
    textContent: string;

    constructor(input: string) {
        // 找到参数起始位置
        const argsStart = input.indexOf('(');
        const argsEnd = input.lastIndexOf(')');

        if (argsStart === -1 || argsEnd === -1) {
            throw new Error(`Invalid input format for ${DialogFunctionText.name}. text = ${input}`);
        }

        const functionName = input.substring(1, argsStart).trim();
        const args = input.substring(argsStart + 1, argsEnd).trim();
        // 跳过 )] 的函数文本结束位置
        const textContent = input.substring(argsEnd + 2).trim();

        const functionText: string = `${functionName}(${args})`;
        this.functionText = new FunctionText(functionText);
        this.textContent = textContent;
    }
}