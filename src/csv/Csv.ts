/**
 * CSV
 */
export default class Csv {
    private columns: string[];

    constructor(csvText: string) {
        this.columns = this.parseCSV(csvText);
    }

    private parseCSV(csvText: string): string[] {
        return csvText.split(',').map((item) => item.trim());
    }

    private isNumber(value: string): boolean {
        return !isNaN(Number(value));
    }

    private isSafeInteger(value: number,
                          min: number,
                          max: number
    ): boolean {
        return value >= min && value <= max && Number.isSafeInteger(value);
    }

    private getSafeNumber(value: string,
                          min: number,
                          max: number
    ): number | null {
        if (this.isNumber(value)) {
            const numberValue = Number(value);
            if (this.isSafeInteger(numberValue, min, max)) {
                return numberValue;
            }
        }
        return null;
    }

    public getNumber(column: number,
                     min: number = Number.MIN_SAFE_INTEGER,
                     max: number = Number.MAX_SAFE_INTEGER
    ): number | null {
        if (column >= 0 && column < this.columns.length) {
            return this.getSafeNumber(this.columns[column], min, max);
        }
        return null;
    }

    public getString(column: number): string | null {
        if (column >= 0 && column < this.columns.length) {
            return this.columns[column];
        }
        return null;
    }

    public getAllColumns(): string[] {
        return this.columns;
    }
}
