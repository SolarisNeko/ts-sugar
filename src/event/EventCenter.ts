import {LazySingleton} from "../core/LazySingleton";

export interface EventCallbackHandler<T> {
    self: any;
    callback: (arg: T) => void;
    once: boolean;
}

export class EventCenter extends LazySingleton {


    private _listeners: Map<string, EventCallbackHandler<any>[]> = new Map();

    public on<T>(eventName: string, callback: (arg: T) => void, self: any, once = false) {
        const eventCallback: EventCallbackHandler<T> = {
            self,
            callback,
            once,
        };

        if (!this._listeners.has(eventName)) {
            this._listeners.set(eventName, []);
        }

        this._listeners.get(eventName)!.push(eventCallback);
    }

    public off<T>(eventName: string, callback: (arg: T) => void, self: any) {
        if (!this._listeners.has(eventName)) {
            return;
        }

        this._listeners.set(
            eventName,
            this._listeners.get(eventName)!.filter(
                (eventCallback) => !(eventCallback.self === self && eventCallback.callback === callback)
            )
        );
    }

    public trigger<T>(eventName: string, arg: T) {
        if (!this._listeners.has(eventName)) {
            return;
        }

        const listeners = this._listeners.get(eventName)!;

        for (let i = listeners.length - 1; i >= 0; i--) {
            const { self, callback, once } = listeners[i];

            if (!self) {
                console.error('Error: Event callback skipped due to undefined "self".');
                continue;
            }

            try {
                callback.call(self, arg);
            } catch (error) {
                console.error(`Error in event callback for "${eventName}":`, error);
            }
    

            if (once) {
                // Remove the one-time event listener after triggering
                listeners.splice(i, 1);
            }
        }
    }

    public cancelEventsForTarget(target: any): void {
        this._listeners.forEach((handlers, eventName) => {
            this._listeners.set(
                eventName,
                handlers.filter(eventCallback => eventCallback.self !== target)
            );
        });
    }
    
}