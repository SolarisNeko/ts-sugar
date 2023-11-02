export default class ArrayUtils {
    // 合并两个数组并去除重复项
    static mergeArrays<T>(array1: T[],
                          array2: T[]
    ): T[] {
        return Array.from(new Set([...array1, ...array2]));
    }

    // 检查数组是否包含某个元素
    static includes<T>(array: T[],
                       element: T
    ): boolean {
        return array.includes(element);
    }

    // 数组元素去重
    static removeDuplicates<T>(array: T[]): T[] {
        return Array.from(new Set(array));
    }

    // 在数组中查找符合条件的元素
    static findElement<T>(array: T[],
                          condition: (element: T) => boolean
    ): T | undefined {
        return array.find(condition);
    }

    // 数组映射
    static mapArray<T, U>(array: T[],
                          mapper: (element: T) => U
    ): U[] {
        return array.map(mapper);
    }

    // 过滤数组
    static filterArray<T>(array: T[],
                          condition: (element: T) => boolean
    ): T[] {
        return array.filter(condition);
    }

    // 从数组中删除指定元素
    static removeElement<T>(array: T[],
                            element: T
    ): T[] {
        return array.filter((el) => el !== element);
    }

    // 从数组中删除所有符合条件的元素
    static removeElementsByCondition<T>(array: T[],
                                        condition: (element: T) => boolean
    ): T[] {
        return array.filter((el) => !condition(el));
    }

    static deleteElement<T>(targetArray: T[],
                            element: T
    ): void {
        const index = targetArray.indexOf(element);
        if (index > -1) {
            targetArray.splice(index, 1);
        }
    }

    static deleteElementCount<T>(targetArray: T[],
                                 element: T,
                                 count: number,
    ): void {
        const index = targetArray.indexOf(element);
        if (index > -1) {
            targetArray.splice(index, count);
        }
    }

    static deleteElementCountByStart<T>(targetArray: T[],
                                 startCount: number,
                                 count: number,
    ): void {
        targetArray.splice(startCount, count);
    }
}