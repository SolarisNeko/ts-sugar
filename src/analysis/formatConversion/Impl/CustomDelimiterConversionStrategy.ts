import { IFormatConversionStrategy } from "../IFormatConversionStrategy";

// 自定义分隔符转其他格式策略类
export class CustomDelimiterConversionStrategy implements IFormatConversionStrategy {
    constructor(private customDelimiter: string) { }
    convert(data: string, delimiter: string): string {
        return data.replace(new RegExp(this.customDelimiter, 'g'), delimiter);
    }
}