import { IFormatConversionStrategy } from "../IFormatConversionStrategy";

// TSV 转其他格式策略类
export class TsvConversionStrategy implements IFormatConversionStrategy {
    convert(data: string, delimiter: string): string {
        return data.replace(/\t/g, delimiter);
    }
}