// Lambda
type Func<T, U> = (item: T) => U;
type PredicateFunc<T> = Func<T, boolean>;
type KeyFunc<T> = Func<T, any>;
type Dict<T> = { [key: string]: T };


export class Stream<T> {

    private readonly data: Iterable<T>;

    static from<T>(data: T[] | Set<T> | Dict<T> | Map<any, T>): Stream<T> {
        if (Array.isArray(data)) {
            return new Stream(data);
        } else if (data instanceof Map) {
            return new Stream(Array.from(data.values()));
        } else if (data instanceof Set) {
            return new Stream(Array.from(data));
        } else if (typeof data === 'object') {
            return new Stream(Object.values(data));
        } else {
            throw new Error(`[Stream] Unsupported data type = ${typeof data}`);
        }
    }


    constructor(data: Iterable<T>) {
        this.data = data;
    }

    sort(sortedFunc: Func<T, any> | null = null,
         reverse = false
    ): Stream<T> {
        return new Stream([...this.data].sort((a,
                                               b
        ) => {
            const keyA = sortedFunc ? sortedFunc(a) : a;
            const keyB = sortedFunc ? sortedFunc(b) : b;
            return reverse ? keyB - keyA : keyA - keyB;
        }));
    }

    map<U>(func: Func<T, U>): Stream<U> {
        return new Stream((function* () {
            for (const item of this.data) {
                yield func(item);
            }
        }).bind(this)());
    }

    flatMap<U>(func: Func<T, Iterable<U>>): Stream<U> {
        return new Stream((function* () {
            for (const sublist of this.data) {
                for (const item of func(sublist)) {
                    yield item;
                }
            }
        }).bind(this)());
    }

    filter(func: PredicateFunc<T>): Stream<T> {
        return new Stream((function* () {
            for (const item of this.data) {
                if (func(item)) {
                    yield item;
                }
            }
        }).bind(this)());
    }

    reduce<U>(reduceFunc: (reduceValue: U,
                           currentValue: T
              ) => U,
              initial: U
    ): U {
        let accumulator = initial;
        for (const item of this.data) {
            accumulator = reduceFunc(accumulator, item);
        }
        return accumulator;
    }

    groupBy(key_func: KeyFunc<T>): Dict<T[]> {
        const groups: Dict<T[]> = {};
        for (const item of this.data) {
            const key = key_func(item);
            if (key in groups) {
                groups[key].push(item);
            } else {
                groups[key] = [item];
            }
        }
        return groups;
    }

    first(): T | null {
        for (const item of this.data) {
            return item;
        }
        return null;
    }

    count(): number {
        let count = 0;
        for (const _ of this.data) {
            count++;
        }
        return count;
    }

    toList(): T[] {
        return [...this.data];
    }

    toDictionary<U>(key_func: KeyFunc<T>,
                    value_func: Func<T, U>
    ): Dict<U> {
        const dictionary: Dict<U> = {};
        for (const item of this.data) {
            dictionary[key_func(item)] = value_func(item);
        }
        return dictionary;
    }

    toSet(): Set<T> {
        return new Set(this.toList());
    }

    max(compareFunc: Func<T, T>): T | null {
        let maxVal: T | null = null;
        for (const item of this.data) {
            if (maxVal === null || compareFunc(item) > compareFunc(maxVal)) {
                maxVal = item;
            }
        }
        return maxVal;
    }

    min(compareFunc: Func<T, T>): T | null {
        let minVal: T | null = null;
        for (const item of this.data) {
            if (minVal === null || compareFunc(item) < compareFunc(minVal)) {
                minVal = item;
            }
        }
        return minVal;
    }
}

