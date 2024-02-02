import {isIInit, isIRemoveBefore} from "./ILifecycle";
import {Clazz} from "../types/Types";


/**
 * get App 能力
 */
export interface ICanGetApp {
    getApp(): IApp;
}

/**
 * set App 能力
 */
export interface ICanSetApp {
    setApp(App: IApp): void;
}

/**
 * 判断对象是否实现了 ICanSetApp 接口
 * @param instance 要检查的对象
 */
function isICanSetApp(instance: any): instance is ICanSetApp {
    return 'setApp' in instance;
}

/**
 * 组件
 */
export interface IComponent extends ICanGetApp, ICanSetApp {
    init(): void;

    removeBefore(): void
}

/**
 * 命令
 */
export interface ICommand extends ICanGetApp, ICanSetApp {
    execute(): void;
}

/**
 * 查询
 */
export interface IQuery<TResult> extends ICanGetApp, ICanSetApp {
    execute(): TResult;
}

/**
 * 注销注册
 */
export interface IUnregister {
    unregister(): void;
}

/**
 * 获取 Class Type
 * @param instance 对象
 */
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

    register<T>(clazz: Clazz<T>,
                instance: T,
    ): void {
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

    /**
     * no-args constructor clazz
     * @param type
     */
    registerComponentByClazz<T extends IComponent>(type: Clazz<T>): void

    // component 
    registerComponent<T extends IComponent>(component: T): void;

    getComponent<T extends IComponent>(type: new () => T): T | null;

    // command
    executeCommand<T extends ICommand>(command: T): void;

    // query
    executeQuery<TResult>(query: IQuery<TResult>): TResult;

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
     * @param eventHandler
     */
    registerEventHandler<T>(
        eventHandler: EventHandler<T>,
    ): IUnregister;

    unregisterEvent<T>(clazz: Clazz<T>,
                       eventHandler: EventHandler<T>,
    ): void;

}

/**
 * 抽象组件
 */
export abstract class AbstractComponent implements IComponent {

    private _app: IApp | null = null;

    getApp(): IApp {
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

/**
 * 抽象命令
 */
export abstract class AbstractCommand implements ICommand {
    private _app: IApp | null = null;

    abstract execute(): void;

    getApp(): IApp {
        return this._app;
    }

    setApp(App: IApp): void {
        this._app = App;
    }
}

/**
 * 抽象查询
 */
export abstract class AbstractQuery<TResult> implements IQuery<TResult> {
    private _app: IApp | null = null;

    abstract execute(): TResult;

    getApp(): IApp {
        return this._app;
    }

    setApp(App: IApp): void {
        this._app = App;
    }
}


/**
 * 事件处理器
 */
export class EventHandler<T> {
    // 事件类型
    clazz: Clazz<T>;
    // handler
    onEvent: (event: T) => void;
    // 是否是一次性的
    onceFlag: boolean = false;

    /**
     * 构造
     * @param clazz
     * @param onEvent
     * @param onceFlag
     */
    constructor(
        clazz: Clazz<T>,
        onEvent: (e: T) => void,
        onceFlag: boolean,
    ) {
        this.clazz = clazz;
        this.onEvent = onEvent;
        this.onceFlag = onceFlag

    }

    /**
     * 处理器名字
     */
    name(): String {
        return this.clazz.name
    }

    /**
     * 是否是一次性的
     */
    isOnce(): boolean {
        return this.onceFlag
    }

    /**
     * 处理事件
     * @param event 事件
     */
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
                            handler: EventHandler<any>,
    ) {
        // 不影响其他 EventHandler
        console.error(`[EventSystemByClazz] execute error. handler name = ${handler.name}, event = `,
            event,
            e,
        )

    }

    unregister<T>(clazz: Clazz<T>,
                  eventHandler: EventHandler<T>,
    ): void {
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

    register<T>(clazz: Clazz<T>,
                eventHandler: EventHandler<T>,
    ): IUnregister {

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

    unregisterByClazz<T>(clazz: Clazz<T>) {
        this.onceEventHandlerMap.delete(clazz)
        this.eventHandlerMap.delete(clazz)
    }

    unregisterAll<T>() {
        this.onceEventHandlerMap.clear()
        this.eventHandlerMap.clear()
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
     * [Core] new App + run() 是基本法则
     *
     * 开始运行该 App
     */
    public run(): void {
        this._container.setApp(this);
        if (!this._initFlag) {
            this.init();

            this._initFlag = true;

            this.afterInit();

        }
    }

    getAppName(): String {
        return this._name;
    }


    protected abstract init(): void;


    public registerComponentByClazz<T>(type: Clazz<T>): void {
        let component = new type(null)
        return this.registerComponent(component)
    }

    public registerComponent<T>(instance: T): void {
        const type = getInstanceType(instance);

        // 组件 ?
        if (instance instanceof AbstractComponent) {
            instance.setApp(this)
            instance.init()
        }
        this._container.register<T>(type, instance);
    }


    public getComponent<T>(
        type: Clazz<T>,
    ): T {
        return this._container.get<T>(type);
    }

    /**
     * 执行查询
     * @param command 命令封装
     */
    public executeCommand<TCommand extends ICommand>(command: TCommand): void {
        command.setApp(this);
        command.execute();
    }

    /**
     * 执行查询
     * @param query 查询封装
     */
    public executeQuery<TResult>(query: IQuery<TResult>): TResult {
        query.setApp(this);
        return query.execute();
    }


    /**
     * 发送一个事件
     * @param event 事件
     */
    public sendEvent<TEvent>(event: TEvent): void {
        this.eventSystem.send<TEvent>(event);
    }

    /**
     * 注册事件
     * @param eventHandler 事件处理器
     */
    public registerEventHandler<TEvent>(
        eventHandler: EventHandler<TEvent>,
    ): IUnregister {
        let eventClazz = eventHandler.clazz;
        return this.eventSystem.register<TEvent>(eventClazz, eventHandler);
    }

    /**
     * 注销注册事件
     * @param clazz
     * @param eventHandler
     */
    public unregisterEvent<TEvent>(
        clazz: Clazz<TEvent>,
        eventHandler: EventHandler<TEvent>,
    ): void {
        this.eventSystem.unregister<TEvent>(clazz, eventHandler);
    }


    public unregisterEventAll<TEvent>(
        clazz: Clazz<TEvent>,
    ): void {
        this.eventSystem.unregisterByClazz<TEvent>(clazz);
    }

    public afterInit() {

    }
}
