import {Clazz} from "../types/Types";

/**
 * JSON 配置管理器
 * - singleton instance
 */
export class ConfigManager {

    private static _instance: ConfigManager;

    private typeToDataMap: Map<Clazz<any>, any[]> = new Map()

    // 私有构造函数，防止直接实例化
    private constructor() {
    }

    // 获取单例实例
    public static get instance(): ConfigManager {
        if (!this._instance) {
            this._instance = new ConfigManager();
        }
        return this._instance;
    }

    private copyProperty(source: any, destination: any): void {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                destination[key] = source[key];
            }
        }
    }

    /**
     * 获取已加载的数据列表
     * @param jsonObjType json对象类型
     */
    public getDataListByType<T>(jsonObjType: Clazz<T>): T[] | null {
        return this.typeToDataMap.get(jsonObjType) || null;
    }

    /**
     * 获取一个数据
     * @param jsonObjType
     * @param defaultValue
     */
    getDataOneByType<T>(jsonObjType: Clazz<T>, defaultValue: T | null = null): T | null {
        const dataList = this.getDataListByType(jsonObjType);
        if (dataList && dataList.length > 0) {
            return dataList[0];
        }
        return defaultValue;
    }

    /**
     * 更新或插入数据列表
     * @param jsonObjType
     * @param dataList
     */
    public updateDataList<T>(jsonObjType: Clazz<T>, dataList: T[]): void {
        this.typeToDataMap.set(jsonObjType, [...dataList]);
    }

    /**
     * 删除数据列表
     * @param jsonObjType
     */
    public deleteDataList<T>(jsonObjType: Clazz<T>): void {
        this.typeToDataMap.delete(jsonObjType);
    }
}
