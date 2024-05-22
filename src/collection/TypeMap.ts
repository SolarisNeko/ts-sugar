import {Clazz} from "../types/Types";
import {MergeFunction} from "../utils/LambdaExtension";

export class TypeMap {
    // 类型 Map
    private _typeMap = new Map<Clazz<any>, any>();

    get<T>(clazz: Clazz<T>): T | undefined {
        return this._typeMap.get(clazz) as T;
    }

    put<T>(clazz: Clazz<T>, instance: T): void {
        this._typeMap.set(clazz, instance);
    }

    getOrCreate<T>(clazz: Clazz<T>, factory: () => T): T {
        let instance = this.get(clazz);

        if (!instance) {
            instance = factory();
            this.put(clazz, instance);
        }

        return instance;
    }

    merge<T>(clazz: Clazz<T>, value: T, mergeFunc: MergeFunction<T>): T {
        return this._typeMap.merge(clazz, value, mergeFunc);
    }

    remove<T>(clazz: Clazz<T>): T {
        let instance = this.get(clazz);
        this._typeMap.delete(clazz);
        return instance;
    }

    removeReturnSelf<T>(clazz: Clazz<T>): TypeMap {
        this._typeMap.delete(clazz);
        return this;
    }
}
