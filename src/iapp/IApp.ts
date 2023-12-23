export type Clazz<T = any> = new (...args: any[]) => T;
function getInstanceType<T>(instance: T): Clazz<T> {
    return instance.constructor as Clazz<T>;
}

export class IocContainer {
    private container: Map<Clazz, any> = new Map();

    register<T>(clazz: Clazz<T>, instance: T): void {
        if (this.container.has(clazz)) {
            throw new Error(`Class ${clazz.name} is already registered in the IoC container.`);
        }

        this.container.set(clazz, instance);
    }

    get<T>(clazz: Clazz<T>): T | null {
        return this.container.get(clazz) || null;
    }

    remove<T>(clazz: Clazz<T>): void {
        this.container.delete(clazz);
    }
}

export interface IArchitecture {
    // component 
    registerComponent<T extends IComponent>(component: T): void;
    getComponent<T extends IComponent>(type: new () => T): T | null;

    // command
    sendCommand<T extends ICommand>(command: T): void;

    // query
    sendQuery<TResult>(query: IQuery<TResult>): TResult;

    // event
    sendEvent<T>(event?: T): void;

    /**
     *  let eventHandler = new EventHandler(
            clazz,
            onEvent,
            onceFlag
        )
     * @param clazz 
     * @param eventHandler 
     */
    registerEvent<T>(
        clazz: Clazz<T>,
        eventHandler: EventHandler<T>,
    ): IUnregister;
    unregisterEvent<T>(clazz: Clazz<T>,
        eventHandler: EventHandler<T>,
    ): void;

}


export interface ICanGetArchitecture {
    getArchitecture(): IArchitecture;
}

export interface ICanSetArchitecture {
    setArchitecture(architecture: IArchitecture): void;
}


export interface IComponent extends ICanGetArchitecture, ICanSetArchitecture {
    init(): void;
}

export interface ICommand extends ICanGetArchitecture, ICanSetArchitecture {
    execute(): void;
}

export interface IQuery<TResult> extends ICanGetArchitecture, ICanSetArchitecture {
    execute(): TResult;
}

export interface IUnregister {
    unregister(): void;
}


export abstract class AbstractComponent implements IComponent {
    private architecture: IArchitecture | null = null;

    abstract init(): void;

    getArchitecture(): IArchitecture {
        if (!this.architecture) {
            throw new Error('Architecture is not set for the component.');
        }
        return this.architecture;
    }

    setArchitecture(architecture: IArchitecture): void {
        this.architecture = architecture;
    }
}

export abstract class AbstractCommand implements ICommand {
    private architecture: IArchitecture | null = null;

    abstract execute(): void;

    getArchitecture(): IArchitecture {
        if (!this.architecture) {
            throw new Error('Architecture is not set for the command.');
        }
        return this.architecture;
    }

    setArchitecture(architecture: IArchitecture): void {
        this.architecture = architecture;
    }
}

export abstract class AbstractQuery<TResult> implements IQuery<TResult> {
    private architecture: IArchitecture | null = null;

    abstract execute(): TResult;

    getArchitecture(): IArchitecture {
        if (!this.architecture) {
            throw new Error('Architecture is not set for the command.');
        }
        return this.architecture;
    }

    setArchitecture(architecture: IArchitecture): void {
        this.architecture = architecture;
    }
}


/**
 * 事件处理器
 */
export class EventHandler<T>{
    clazz: Clazz<T>;
    onEvent: (e: T) => void;
    onceFlag: boolean = false;

    constructor(
        clazz: Clazz<T>,
        onEvent: (e: T) => void,
        onceFlag: boolean,
    ) {
        this.clazz = clazz;
        this.onEvent = onEvent;
        this.onceFlag = onceFlag

    }

    isOnce(): boolean {
        return this.onceFlag
    }


    handle(event: T): void {
        this.onEvent.call(this, event)
    }
}

/**
 * 类型事件系统
 */
export class TypeEventSystem {
    private eventHandlerMap: Map<Clazz, EventHandler<any>[]> = new Map();
    private onceEventHandlerMap: Map<Clazz, EventHandler<any>[]> = new Map();

    send<TEvent>(event: TEvent): void {
        const clazz = event.constructor as Clazz<TEvent>;

        // Notify regular event handlers
        const regularHandlers = this.eventHandlerMap.get(clazz);
        if (regularHandlers) {
            regularHandlers.forEach((handler) => {
                handler.handle(event);
            });
        }

        // Notify once event handlers and remove them
        const onceHandlers = this.onceEventHandlerMap.get(clazz);
        if (onceHandlers) {
            onceHandlers.forEach((handler) => {
                handler.handle(event);
            });
            this.onceEventHandlerMap.delete(clazz);
        }
    }

    unregister<T>(clazz: Clazz<T>, eventHandler: EventHandler<T>): void {
        const handlers = this.eventHandlerMap.get(clazz);
        if (handlers) {
            const index = handlers.indexOf(eventHandler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }

        const onceHandlers = this.onceEventHandlerMap.get(clazz);
        if (onceHandlers) {
            const index = onceHandlers.indexOf(eventHandler);
            if (index !== -1) {
                onceHandlers.splice(index, 1);
            }
        }
    }

    register<T>(clazz: Clazz<T>, eventHandler: EventHandler<T>): IUnregister {

        if (eventHandler.isOnce()) {
            const onceHandlers = this.onceEventHandlerMap.get(clazz) || [];
            onceHandlers.push(eventHandler);
            this.onceEventHandlerMap.set(clazz, onceHandlers);
        } else {
            const handlers = this.eventHandlerMap.get(clazz) || [];
            handlers.push(eventHandler);
            this.eventHandlerMap.set(clazz, handlers);
        }

        return {
            unregister: () => this.unregister(clazz, eventHandler),
        } as IUnregister;
    }
}

export  abstract class Architecture<T extends Architecture<T>> implements IArchitecture {
    // 是否已经初始化
    private mInited: boolean = false;
    // 
    private mComponents: Set<IComponent> = new Set<IComponent>();

    // 已有的架构
    // Note: Use 'any' here, as we cannot directly refer to 'T' in a static context.
    protected static mArchitecture: Architecture<any>;

    public static OnregisterPatch: (architecture: Architecture<any>) => void = architecture => { };

    // ioc 容器
    private mContainer: IocContainer = new IocContainer();

    // 类型事件系统
    private eventSystem: TypeEventSystem = new TypeEventSystem();

    public static get Interface(): IArchitecture {
        if (!this.mArchitecture) {
            this.createApp();
        }
        return this.mArchitecture;
    }

    private static createApp(): void {
        if (!this.mArchitecture) {
            this.mArchitecture = new (this as any)();
            this.mArchitecture.init();

            this.OnregisterPatch?.(this.mArchitecture);

            this.mArchitecture.mComponents.forEach(architectureComponent => {
                architectureComponent.init();
            });
            this.mArchitecture.mComponents.clear();

            this.mArchitecture.mInited = true;
        }
    }

    protected abstract init(): void;

    public registerComponent<TComponent extends IComponent>(component: TComponent): void {
        component.setArchitecture(this);
        const type = getInstanceType(component);
        this.mContainer.register<TComponent>(type, component);

        if (!this.mInited) {
            this.mComponents.add(component);
        } else {
            component.init();
        }
    }


    public getComponent<TComponent extends IComponent>(type: Clazz): TComponent {
        return this.mContainer.get<TComponent>(type);
    }


    public sendCommand<TCommand extends ICommand>(command: TCommand): void {
        this.executeCommand(command);
    }

    public sendQuery<TResult>(query: IQuery<TResult>): TResult {
        return this.doQuery(query);
    }


    protected executeCommand(command: ICommand): void {
        command.setArchitecture(this);
        command.execute();
    }

    protected doQuery<TResult>(query: IQuery<TResult>): TResult {
        query.setArchitecture(this);
        return query.execute();
    }

    public sendEvent<TEvent>(event: TEvent): void {
        this.eventSystem.send<TEvent>(event);
    }

    public registerEvent<TEvent>(
        clazz: Clazz<TEvent>,
        eventHandler: EventHandler<TEvent>,
    ): IUnregister {

        return this.eventSystem.register<TEvent>(clazz, eventHandler);
    }

    public unregisterEvent<TEvent>(
        clazz: Clazz<TEvent>,
        eventHandler: EventHandler<TEvent>,
    ): void {
        this.eventSystem.unregister<TEvent>(clazz, eventHandler);
    }
}
