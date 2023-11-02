type Callback = (data: any) => void;


export default class Actor {
    private callbacks: ((data: any) => void)[] = [];

    private callbackMap: Map<string, Callback | Callback[]> = new Map();

    registerExclusiveCallback(key: string,
                              callback: Callback
    ): void {
        this.callbackMap.set(key, callback);
    }

    registerMultipleCallbacks(key: string,
                              callbacks: Callback[]
    ): void {
        this.callbackMap.set(key, callbacks);
    }

    addCallback(key: string,
                callback: Callback
    ): void {
        const existingCallbacks = this.callbackMap.get(key);
        if (existingCallbacks) {
            if (Array.isArray(existingCallbacks)) {
                existingCallbacks.push(callback);
            } else {
                this.callbackMap.set(key, [existingCallbacks, callback]);
            }
        } else {
            this.callbackMap.set(key, callback);
        }
    }

    executeCallbacks(key: string,
                     data: any
    ): void {
        const callbackOrArray = this.callbackMap.get(key);

        if (callbackOrArray) {
            if (Array.isArray(callbackOrArray)) {
                for (const callback of callbackOrArray) {
                    callback(data);
                }
            } else {
                callbackOrArray(data);
            }
        }
    }

    removeCallbackSingle(key: string,
                         callback: Callback
    ): void {
        const existingCallbacks = this.callbackMap.get(key);

        if (existingCallbacks) {
            if (Array.isArray(existingCallbacks)) {
                const updatedCallbacks = existingCallbacks.filter(cb => cb !== callback);
                if (updatedCallbacks.length > 0) {
                    this.callbackMap.set(key, updatedCallbacks);
                } else {
                    this.callbackMap.delete(key);
                }
            } else {
                if (existingCallbacks === callback) {
                    this.callbackMap.delete(key);
                }
            }
        }
    }

    removeCallback(key: string): void {
        this.callbackMap.delete(key);
    }

    scheduleOnce(callback: () => void,
                 delayMs: number
    ): void {
        setTimeout(callback, delayMs);
    }

    scheduleInterval(callback: () => void,
                     intervalMs: number
    ) {
        setInterval(callback, intervalMs);
    }

    scheduleRepeated(callback: () => void,
                     initialDelayMs: number,
                     intervalMs: number
    ) {
        setTimeout(() => {
            callback();
            this.scheduleInterval(callback, intervalMs);
        }, initialDelayMs);
    }
}