// 定义格式转换策略接口
export interface IFormatConversionStrategy {
    convert(data: string, delimiter: string): string;
}