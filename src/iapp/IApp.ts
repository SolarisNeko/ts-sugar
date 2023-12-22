interface IArchitecture {
    registerSystem<T extends ISystem>(system: T): void;
    registerModel<T extends IModel>(model: T): void;
    registerUtility<T extends IUtility>(utility: T): void;

    getSystem<T extends ISystem>(type: new () => T): T | null;
    getModel<T extends IModel>(type: new () => T): T | null;
    getUtility<T extends IUtility>(type: new () => T): T | null;

    sendCommand<T extends ICommand>(command: T): void;

    sendQuery<TResult>(query: IQuery<TResult>): TResult;

    sendEvent<T>(event?: T): void;
    registerEvent<T>(onEvent: (e: T) => void): IUnRegister;
    unRegisterEvent<T>(onEvent: (e: T) => void): void;

}


interface ISystem {
    getArchitecture(): IArchitecture;
}

interface IModel {
    getArchitecture(): IArchitecture;
}

interface IUtility {
    getArchitecture(): IArchitecture;
}

interface ICommand {
    execute(): void;
}

interface IQuery<TResult> {
    do(): TResult;
}

interface IUnRegister {
    unRegister(): void;
}


abstract class Architecture<T extends Architecture<T>> implements IArchitecture {
    private mInited: boolean = false;
    private mSystems: Set<ISystem> = new Set<ISystem>();
    private mModels: Set<IModel> = new Set<IModel>();
    protected static mArchitecture: Architecture<any>; // Note: Use 'any' here, as we cannot directly refer to 'T' in a static context.

    public static OnRegisterPatch: (architecture: Architecture<any>) => void = architecture => {};

    private mContainer: IOCContainer = new IOCContainer();
    private mTypeEventSystem: TypeEventSystem = new TypeEventSystem();

    public static get Interface(): IArchitecture {
        if (!this.mArchitecture) {
            this.MakeSureArchitecture();
        }
        return this.mArchitecture;
    }

    private static MakeSureArchitecture(): void {
        if (!this.mArchitecture) {
            this.mArchitecture = new (this as any)();
            this.mArchitecture.Init();

            this.OnRegisterPatch?.(this.mArchitecture);

            this.mArchitecture.mModels.forEach(architectureModel => {
                architectureModel.Init();
            });
            this.mArchitecture.mModels.clear();

            this.mArchitecture.mSystems.forEach(architectureSystem => {
                architectureSystem.Init();
            });
            this.mArchitecture.mSystems.clear();

            this.mArchitecture.mInited = true;
        }
    }

    protected abstract Init(): void;

    public registerSystem<TSystem extends ISystem>(system: TSystem): void {
        system.SetArchitecture(this);
        this.mContainer.Register<TSystem>(system);

        if (!this.mInited) {
            this.mSystems.add(system);
        } else {
            system.Init();
        }
    }

    public registerModel<TModel extends IModel>(model: TModel): void {
        model.SetArchitecture(this);
        this.mContainer.Register<TModel>(model);

        if (!this.mInited) {
            this.mModels.add(model);
        } else {
            model.Init();
        }
    }

    public registerUtility<TUtility extends IUtility>(utility: TUtility): void {
        this.mContainer.Register<TUtility>(utility);
    }

    public getSystem<TSystem extends ISystem>(type: new () => TSystem): TSystem {
        return this.mContainer.Get<TSystem>();
    }

    public getModel<TModel extends IModel>(type: new () => TModel): TModel {
        return this.mContainer.Get<TModel>();
    }

    public getUtility<TUtility extends IUtility>(type: new () => TUtility): TUtility {
        return this.mContainer.Get<TUtility>();
    }

    public sendCommand<TCommand extends ICommand>(command: TCommand): void {
        this.ExecuteCommand(command);
    }

    public sendQuery<TResult>(query: IQuery<TResult>): TResult {
        return this.DoQuery(query);
    }

    protected ExecuteCommand<TResult>(command: ICommand<TResult>): TResult {
        command.SetArchitecture(this);
        return command.Execute();
    }

    protected ExecuteCommand(command: ICommand): void {
        command.SetArchitecture(this);
        command.Execute();
    }

    protected DoQuery<TResult>(query: IQuery<TResult>): TResult {
        query.SetArchitecture(this);
        return query.Do();
    }

    public sendEvent<TEvent>(event?: TEvent): void {
        this.mTypeEventSystem.Send<TEvent>(event);
    }

    public registerEvent<TEvent>(onEvent: (e: TEvent) => void): IUnRegister {
        return this.mTypeEventSystem.Register<TEvent>(onEvent);
    }

    public unRegisterEvent<TEvent>(onEvent: (e: TEvent) => void): void {
        this.mTypeEventSystem.UnRegister<TEvent>(onEvent);
    }
}
