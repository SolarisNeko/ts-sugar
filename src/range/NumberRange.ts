export class NumberRange {
    readonly start: number;
    readonly end: number;

    private constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    public static create(start: number, end: number): NumberRange {
        if (start > end) {
            throw new Error('Invalid range: start must be less than or equal to end');
        }

        return new NumberRange(start, end);
    }

    public isIn(num: number): boolean {
        return num >= this.start && num <= this.end;
    }
    public isNotIn(num: number): boolean {
        return !this.isIn(num);
    }
}


type NumberCallback = (num: number) => void;

export class NumberRangeSelector {
    private ranges: { range: NumberRange; callback: NumberCallback }[] = [];

    add(range: NumberRange, callback: NumberCallback): void {
        this.ranges.push({ range, callback });
    }

    remove(range: NumberRange, callback: NumberCallback): void {
        this.ranges = this.ranges.filter(
            (entry) => entry.range.start !== range.start || entry.range.end !== range.end || entry.callback !== callback
        );
    }

    handle(num: number): void {
        for (const { range, callback } of this.ranges) {
            if (range.isIn(num)) {
                callback(num);
                // Assuming only one callback should be triggered for a given number
                return;
            }
        }
    }
}