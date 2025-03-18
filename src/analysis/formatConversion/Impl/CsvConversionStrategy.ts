import { IFormatConversionStrategy } from "../IFormatConversionStrategy";

// CSV 转其他格式策略类
export class CsvConversionStrategy implements IFormatConversionStrategy {
    convert(data: string, delimiter: string): string {
        return data.replace(/,/g, delimiter);
    }
}