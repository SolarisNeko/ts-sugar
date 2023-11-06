export default class BeanUtils {
    /**
     * 将源对象的属性拷贝到目标对象
     * @param source 源对象
     * @param target 目标对象
     */
    static copyProperties<T, U>(source: T,
                                target: U): U {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                // @ts-ignore
                target[key] = source[key];
            }
        }
        return target;
    }
}