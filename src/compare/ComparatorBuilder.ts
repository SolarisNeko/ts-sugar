/**
 * 比较器 API
 */
export type Comparator<T> = (a: T, b: T) => number;

/**
 * 比较器构造器 | 链式比较
 * @author luohaojun
 *
 * -----
 * demo 1:
 * const personComparator = ComparatorBuilder.create<Person>()
 *   .addComparator((a: Person, b: Person) => a.age - b.age)
 *   .addComparator((a: Person, b: Person) => a.lastName.localeCompare(b.lastName))
 *   .addComparator((a: Person, b: Person) => a.firstName.localeCompare(b.firstName))
 *   .build();
 *
 *   peopleArray.sort(sortFunc);
 *
 * -----
 * demo 2:
 *     // 先比较状态，再比较进度
 *     private readonly comparatorOrderByStateThenProgress = ComparatorBuilder.create<TaskData>()
 *         .addComparator((a, b) => {
 *             if (a.state == TaskState.FINISHED && b.state == TaskState.FINISHED) {
 *                 return 0;
 *             }
 *             if (a.state == TaskState.FINISHED) {
 *                 return 1;
 *             }
 *             if (b.state == TaskState.FINISHED) {
 *                 return -1;
 *             }
 *             return b.state - a.state
 *         })
 *         .addComparator((a, b) => b.currentProgress - a.currentProgress)
 *         .build()
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
        return (a: T, b: T): number => {
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
