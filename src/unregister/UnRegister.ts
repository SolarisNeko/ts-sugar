/**
 * 提供给组件设置 callback 用
 */
export interface IUnRegister {
    unregister(): void;
}

export class UnRegister implements IUnRegister {
    unregister(): void {
        // 实现你的解注册逻辑
    }

    static create(callback: () => void): UnRegister {
        const instance = new UnRegister();
        instance.unregister = callback;
        return instance;
    }
}

/**
 * 取消组
 */
export class UnRegisterGroup implements IUnRegister {
    private unregisterList: IUnRegister[] = [];

    private constructor() {
        // 防止直接实例化
    }

    public static of(...unregisters: IUnRegister[]): UnRegisterGroup {
        const group = new UnRegisterGroup();
        group.unregisterList = [...unregisters];
        return group;
    }

    public add(unregister: IUnRegister): UnRegisterGroup {
        this.unregisterList.push(unregister);
        return this;
    }

    public unregister(): void {
        for (const unregister of this.unregisterList) {
            if (!unregister) {
                continue
            }
            if (unregister.unregister) {
                unregister.unregister();
            }
        }
        this.unregisterList = [];
    }
}
