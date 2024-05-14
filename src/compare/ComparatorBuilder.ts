export type Comparator<T> = (a: T, b: T) => number;

/**
 * 比较器构造器 | 链式比较
 * 
 * demo:
 * const personComparator = ComparatorBuilder.create<Person>()
 *   .addComparator((a: Person, b: Person) => a.age - b.age)
 *   .addComparator((a: Person, b: Person) => a.lastName.localeCompare(b.lastName))
 *   .addComparator((a: Person, b: Person) => a.firstName.localeCompare(b.firstName))
 *   .build();
 *   
 *   peopleArray.sort(sortFunc);
 */
export class ComparatorBuilder<T> {
    private readonly comparators: Comparator<T>[] = [];

    private constructor() {
        this.comparators = [];
    }

    static create<T>(): ComparatorBuilder<T> {
        return new ComparatorBuilder<T>();
    }

    addComparator(comparator: Comparator<T>): ComparatorBuilder<T> {
        this.comparators.push(comparator);
        return this;
    }

    build(): Comparator<T> {
        return (a: T, b: T) => {
            for (const comparator of this.comparators) {
                const result = comparator(a, b);
                if (result !== 0) {
                    return result;
                }
            }
            return 0;
        };
    }
}
