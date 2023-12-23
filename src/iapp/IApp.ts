import {isIInit, isIRemoveBefore} from "./ILifecycle";
import {ICommand, IComponent, IQuery, IUnregister} from "./IAppApi";

export type Clazz<T = any> = new (...args: any[]) => T;

export function getInstanceType<T>(instance: T): Clazz<T> {
    return instance.constructor as Clazz<T>;
}


/**
 * IOC 容器
 */
export class IocContainer {
    /**
     * singleton
     * @private
     */
    private singletonMap: Map<Clazz, any> = new Map();
    private _app: IApp;

    register<T>(clazz: Clazz<T>, instance: T): void {
        if (this.singletonMap.has(clazz)) {
            throw new Error(`Class ${clazz.name} is already registered in the IoC container.`);
        }

        this.singletonMap.set(clazz, instance);

        if (isIInit(instance)) {
            instance.init(this._app)
        }

    }


    get<T>(clazz: Clazz<T>): T | null {
        return this.singletonMap.get(clazz) || null;
    }

    remove<T>(clazz: Clazz<T>): void {

        let instance = this.singletonMap.get(clazz);
        if (!instance) {
            return
        }

        if (isIRemoveBefore(instance)) {
            instance.remove(this._app);
        }

        this.singletonMap.delete(clazz);

    }

    setApp(app: IApp) {
        this._app = app

    }
}

/**
 * App
 */
export interface IApp {

    getAppName(): String

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
     *  @code
     *  let eventHandler = new EventHandler(
     *      clazz,
     *      onEvent,
     *      onceFlag
     * )
     *
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


export abstract class AbstractComponent implements IComponent {

    private _app: IApp | null = null;

    getApp(): IApp {
        if (!this._app) {
            throw new Error('App is not set for the component.');
        }
        return this._app;
    }

    setApp(App: IApp): void {
        this._app = App;
    }

    init(): void {
        // nothing
    }


    removeBefore(): void {
        // nothing
    }


}

export abstract class AbstractCommand implements ICommand {
    private App: IApp | null = null;

    abstract execute(): void;

    getApp(): IApp {
        if (!this.App) {
            throw new Error('App is not set for the command.');
        }
        return this.App;
    }

    setApp(App: IApp): void {
        this.App = App;
    }
}

export abstract class AbstractQuery<TResult> implements IQuery<TResult> {
    private App: IApp | null = null;

    abstract execute(): TResult;

    getApp(): IApp {
        if (!this.App) {
            throw new Error('App is not set for the command.');
        }
        return this.App;
    }

    setApp(App: IApp): void {
        this.App = App;
    }
}


/**
 * 事件处理器
 */
export class EventHandler<T> {
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

    name(): String {
        return this.clazz.name
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
export class EventSystemByClazz {
    // 永久的
    private eventHandlerMap: Map<Clazz, EventHandler<any>[]> = new Map();
    // 一次性的
    private onceEventHandlerMap: Map<Clazz, EventHandler<any>[]> = new Map();

    send<TEvent>(event: TEvent): void {
        const clazz = event.constructor as Clazz<TEvent>;

        // Notify regular event handlers
        const regularHandlers = this.eventHandlerMap.get(clazz);
        if (regularHandlers) {
            regularHandlers.forEach((handler) => {
                try {
                    handler.handle(event);
                } catch (e) {
                    this.handleEventHandlerError(e, event, handler)
                }
            });
        }

        // Notify once event handlers and remove them
        const onceHandlers = this.onceEventHandlerMap.get(clazz);
        if (onceHandlers) {
            onceHandlers.forEach((handler) => {
                try {
                    handler.handle(event);
                } catch (e) {
                    this.handleEventHandlerError(e, event, handler)
                }
            });
            this.onceEventHandlerMap.delete(clazz);
        }
    }

    handleEventHandlerError(e: Error,
                            event: any,
                            handler: EventHandler<any>
    ) {
        // 不影响其他 EventHandler
        console.error(`[EventSystemByClazz] execute error. handler name = ${handler.name}, event = `,
            event,
            e
        )

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


/**
 * 抽象 App
 */
export abstract class AbstractApp
    implements IApp {

    private _name: String = "default";

    constructor(name: String) {
        this._name = name
    }

    // 是否已经初始化
    private _initFlag: boolean = false;

    // ioc 容器
    private _container: IocContainer = new IocContainer();

    // 类型事件系统
    private eventSystem: EventSystemByClazz = new EventSystemByClazz();


    /**
     * 首次创建调用
     * @private
     */
    private create(): void {
        this._container.setApp(this);
        if (!this._initFlag) {
            this.init();

            this._initFlag = true;
        }
    }

    getAppName(): String {
        return this._name;
    }


    protected abstract init(): void;


    public registerComponent<TComponent extends IComponent>(component: TComponent): void {
        const type = getInstanceType(component);


        let existApp = component.getApp();
        if (existApp) {
            throw new Error(`component = ${type.name} 已经绑定了 App 了 app name = ${this.getAppName()}`)
        }
        component.setApp(this);

        if (!this._initFlag) {

            this._container.register<TComponent>(type, component);
        }
    }


    public getComponent<TComponent extends IComponent>(
        type: Clazz<TComponent>
    ): TComponent {
        return this._container.get<TComponent>(type);
    }


    public sendCommand<TCommand extends ICommand>(command: TCommand): void {
        this.executeCommand(command);
    }

    public sendQuery<TResult>(query: IQuery<TResult>): TResult {
        return this.doQuery(query);
    }


    protected executeCommand(command: ICommand): void {
        command.setApp(this);
        command.execute();
    }

    protected doQuery<TResult>(query: IQuery<TResult>): TResult {
        query.setApp(this);
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
