import {IApp} from "./IApp";

export function isIInit(instance: any): instance is IInit {
    return 'init' in instance && typeof instance.init === 'function';
}

export function isIRemoveBefore(instance: any): instance is IRemoveBefore {
    return 'remove' in instance && typeof instance.remove === 'function';
}


export interface IInit {
    init(app: IApp): void
}

export interface IRemoveBefore {
    remove(app: IApp): void
}