import {ObjectUtils} from "./ObjectUtils";


export class ArrayUtils {

    /**
     * 判断数组是否为空
     */
    static isEmpty<T>(array: T[]): boolean {
        return !array || array.length === 0;
    }

    /**
     * 判断数组是否非空
     */
    static isNotEmpty<T>(array: T[]): boolean {
        return !this.isEmpty(array);
    }

    /**
     * 将数组转换为字符串
     */
    static toString<T>(array: T[]): string {
        return array.toString();
    }

    /**
     * 判断两个数组是否相等
     */
    static equals<T>(array1: T[],
                     array2: T[],
    ): boolean {
        if (array1 === array2) {
            return true;
        }

        if (!array1 || !array2) {
            return false;
        }

        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }

    /**
     * 复制数组
     */
    static clone<T>(array: T[]): T[] {
        return array.slice();
    }

    /**
     * 反转数组
     */
    static reverse<T>(array: T[]): T[] {
        return array.slice().reverse();
    }

    /**
     * 连接数组
     */
    static concat<T>(...arrays: T[][]): T[] {
        return ([] as T[]).concat(...arrays);
    }

    /**
     * 在数组指定位置插入元素
     */
    static insert<T>(array: T[],
                     index: number,
                     ...elements: T[]
    ): T[] {
        return array.slice(0, index).concat(elements, array.slice(index));
    }

    /**
     * 删除数组指定位置的元素
     */
    static remove<T>(array: T[],
                     index: number,
    ): T[] {
        return array.slice(0, index).concat(array.slice(index + 1));
    }

    /**
     * 清空数组
     */
    static clear<T>(array: T[]): T[] {
        array = []
        return array;
    }

    static subArray<T>(data: T[],
                       startIndex: number,
                       endIndex: number,
    ): T[] {
        // 确保 startIndex 和 endIndex 在有效范围内
        startIndex = Math.max(startIndex, 0);
        endIndex = Math.min(endIndex, data.length - 1);

        if (startIndex > endIndex) {
            return [];
        }

        // 提取子数组
        const subArr = [];
        for (let i = startIndex; i <= endIndex; i++) {
            subArr.push(data[i]);
        }

        return subArr;
    }

    static subArrayByExclude<T>(data: T[],
                                startIndex: number,
                                endIndex: number,
    ): T[] {
        // 确保 startIndex 和 endIndex 在有效范围内
        startIndex = Math.max(startIndex, 0);
        endIndex = Math.min(endIndex, data.length - 1);

        const subArr = [];
        // 所有
        if (startIndex > endIndex) {
            subArr.push(data);
            return data;
        }

        // 局部
        for (let i = 0; i <= startIndex; i++) {
            subArr.push(data[i]);
        }
        for (let i = endIndex + 1; i <= data.length; i++) {
            subArr.push(data[i]);
        }

        return subArr;
    }

    static contains<T>(numbers: T[],
                       i: T,
    ): boolean {
        return numbers.indexOf(i) !== -1;
    }

    static isSameNumber(array1: number[],
                        array2: number[],
    ): boolean {
        if (array1 == null || array2 == null) {
            return false;
        }
        if (array1.length !== array2.length) {
            return false;
        }

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }

        return true;
    }

    static maxNumber(array: number[]) {
        if (ObjectUtils.isNullOrUndefined(array)) {
            return null;
        }
        if (array.length === 0) {
            return undefined; // 数组为空，返回 undefined
        }

        let max = array[0]; // 假设第一个元素为最大值

        for (let i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i]; // 更新最大值
            }
        }

        return max;
    }

    static randomOneData<T>(array: T[]) {
        if (ObjectUtils.isNullOrUndefined(array)) {
            return null;
        }
        // 生成随机索引
        const randomIndex: number = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    /**
     * 删除元素
     * @param array 数组
     * @param index 下标
     * @param deleteCount 删除数量
     */
    removeElements(array: any[],
                   index: number,
                   deleteCount: number = 1,
    ) {
        let lastIndex = index + deleteCount;
        if (array.length >= lastIndex) {
            return
        }
        array.slice(index, deleteCount)
    }

    /**
     * 检查数组索引是否在有效范围内
     * @param array
     * @param index
     */
    static isInSafeIndex<T>(array: T[], index: number): boolean {
        if (!array) {
            return false
        }
        return index >= 0 && index < array.length;
    }

    static isNotInSafeIndex<T>(array: T[], index: number): boolean {
        return !this.isInSafeIndex(array, index)
    }
}

