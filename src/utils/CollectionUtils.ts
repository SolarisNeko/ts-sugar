/**
 * @author LuoHaoJun on 2023-06-20
 */
export default class CollectionUtils {


    static isEmpty(collection: any): boolean {
        return collection == null || collection.length === 0;
    }

    static isNotEmpty(collection: any): boolean {
        return !CollectionUtils.isEmpty(collection);
    }

    static contains(collection: any,
                    object: any): boolean {
        if (CollectionUtils.isEmpty(collection)) {
            return false;
        }
        return collection.indexOf(object) !== -1;
    }

}