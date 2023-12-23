import {IApp} from "./IApp";

export interface ICanGetApp {
    getApp(): IApp;
}

export interface ICanSetApp {
    setApp(App: IApp): void;
}


export interface IComponent extends ICanGetApp, ICanSetApp {
    init(): void;

    removeBefore(): void
}

export interface ICommand extends ICanGetApp, ICanSetApp {
    execute(): void;
}

export interface IQuery<TResult> extends ICanGetApp, ICanSetApp {
    execute(): TResult;
}

export interface IUnregister {
    unregister(): void;
}