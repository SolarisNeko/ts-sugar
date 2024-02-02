import {Clazz} from "../types/Types";

export class TypeMap {
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
}
