export default class IoCContainer {
    private instances: Map<new (...args: any) => any, any>;
    private static instance: IoCContainer;

    private constructor() {
        this.instances = new Map();
    }

    public static getInstance(): IoCContainer {
        if (!IoCContainer.instance) {
            IoCContainer.instance = new IoCContainer();
        }
        return IoCContainer.instance;
    }

    register<T>(key: new (...args: any) => T,
                instance: T
    ): void {
        this.instances.set(key, instance);
    }

    get<T>(key: new (...args: any) => T): T | undefined {
        return this.instances.get(key) as T;
    }
}

