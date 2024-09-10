import {Clazz} from "../types/Types";
import {BaseSingleton} from "../core/BaseSingleton";
import {ArrayUtils} from "../utils/ArrayUtils";
import {CloneUtils233} from "../utils/CloneUtils233";
import {DataStream} from "../dataStream/DataStream";

/**
 * 配置管理器
 * - singleton instance
 */
export class ConfigManager233 extends BaseSingleton {

    private _classToDataIdMap: Map<Clazz<any>, Map<number | string, any>> = new Map()

    /**
     * 获取已加载的数据列表
     * @param clazz 配置 class
     * @returns 配置数据列表 array
     */
    public getDataArrayByClazz<T>(clazz: Clazz<T>): T[] {
        const idMap = this._classToDataIdMap.get(clazz);
        if (!idMap) {
            return [];
        }
        return DataStream.fromMap(idMap)
            .map(it => it.value as T)
            .toArray();
    }


    // 返回指定类类型的深拷贝 Map
    public getDeepCopyDataMapByClazz<T>(clazz: Clazz<T>): Map<number | string, T> {
        const idMap = this._classToDataIdMap.get(clazz);
        if (!idMap) {
            return new Map<number | string, T>();
        }

        return CloneUtils233.deepCopy(idMap) as Map<number | string, T>;
    }

    /**
     * 获取一个数据
     * @param configClazz 配置 class
     * @param id 唯一id
     */
    getDataById<T>(configClazz: Clazz<T>,
                   id: number | string,
    ): T | null {
        return this._classToDataIdMap.get(configClazz)?.get(id) as T || null;
    }

    /**
     * 更新或插入数据列表
     * @param clazz 配置 class
     * @param dataList 数据列表
     * @param keyFunc 提取 key 函数
     */
    /**
     * 更新或插入数据列表
     * @param clazz 配置 class
     * @param dataList 数据列表
     * @param keyFunc 提取 key 函数
     */
    public setDataListByClass<T>(clazz: Clazz<T>,
                                 dataList: T[],
                                 keyFunc: (data: T) => number | string
    ): void {
        if (!clazz) {
            return;
        }
        if (ArrayUtils.isEmpty(dataList)) {
            return;
        }
        if (!keyFunc) {
            return;
        }

        let dataIdMap = new Map<number | string, T>();
        dataList.forEach(data => {
            const key = keyFunc(data);
            dataIdMap.set(key, CloneUtils233.deepFreeze(data));
        });

        this._classToDataIdMap.set(clazz, dataIdMap);
    }

    /**
     * 删除数据列表
     * @param jsonObjType
     */
    public removeDataListByClass<T>(jsonObjType: Clazz<T>): void {
        this._classToDataIdMap.delete(jsonObjType);
    }
}
