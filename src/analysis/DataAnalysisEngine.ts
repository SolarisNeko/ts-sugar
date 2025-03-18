import { EnumDataFormat } from './EnumDataFormat';
import { IFormatConversionStrategy } from './formatConversion/IFormatConversionStrategy';
import { CsvConversionStrategy } from './formatConversion/Impl/CsvConversionStrategy';
import { TsvConversionStrategy } from './formatConversion/Impl/TsvConversionStrategy';

// 数据分析引擎类
export class DataAnalysisEngine {
    private formatConversionStrategies: Map<EnumDataFormat, IFormatConversionStrategy> = new Map();

    constructor() {
        this.registerFormatConversionStrategy(EnumDataFormat.CSV, new CsvConversionStrategy());
        this.registerFormatConversionStrategy(EnumDataFormat.TSV, new TsvConversionStrategy());
    }

    registerFormatConversionStrategy(type: EnumDataFormat, strategy: IFormatConversionStrategy) {
        this.formatConversionStrategies.set(type, strategy);
    }

    // 转换格式
    convertFormat(data: string, fromType: EnumDataFormat, toDelimiter: string): string {
        const strategy = this.formatConversionStrategies.get(fromType);
        if (strategy) {
            return strategy.convert(data, toDelimiter);
        }
        throw new Error(`No format conversion strategy found for type: ${fromType}`);
    }

}
