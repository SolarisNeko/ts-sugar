export class SetUtils {

    static isSame<T>(set1: Set<T>, set2: Set<T>): boolean {
        if (set1.size !== set2.size) {
            return false;
        }

        // @ts-ignore
        for (const value of set1) {
            if (!set2.has(value)) {
                return false;
            }
        }

        return true;
    }

}