type Callback = (data: any) => void;


export default class Actor {
    private callbackMap: Map<string, Callback | Callback[]> = new Map();


    // 添加回调，如果 key 已存在回调，则将新的回调追加到现有回调数组中；如果 key 不存在回调，则创建一个新的回调数组
    addCallback(
        key: string,
        callback: Callback | Callback[]
    ): void {
        const existingCallbacks = this.callbackMap.get(key);

        if (existingCallbacks) {
            if (Array.isArray(existingCallbacks)) {
                this.callbackMap.set(key, Array.isArray(callback) ? [...existingCallbacks, ...callback] : [...existingCallbacks, callback]);
            } else {
                this.callbackMap.set(key, Array.isArray(callback) ? [existingCallbacks, ...callback] : [existingCallbacks, callback]);
            }
        } else {
            this.callbackMap.set(key, callback);
        }
    }



    // 执行指定 key 对应的所有回调，并传递给它们指定的数据
    executeCallbacks(key: string, data: any): void {
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

    // 移除单个回调，如果 key 对应的回调是一个数组，从数组中移除指定的回调；如果 key 对应的是单个回调，直接删除
    removeCallbackSingle(key: string, callback: Callback): void {
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

    // 移除指定 key 对应的所有回调
    removeCallback(key: string): void {
        this.callbackMap.delete(key);
    }

    // 单次定时调度，延迟一定时间后执行回调
    scheduleOnce(callback: () => void, delayMs: number): void {
        setTimeout(callback, delayMs);
    }

    // 固定时间间隔调度，循环执行回调
    scheduleInterval(callback: () => void, intervalMs: number) {
        setInterval(callback, 0, intervalMs);
    }

    // 重复调度，首先延迟一定时间，然后以固定时间间隔循环执行回调
    scheduleRepeated(callback: () => void, initialDelayMs: number, intervalMs: number) {
        setTimeout(() => {
            callback();
            this.scheduleInterval(callback, intervalMs);
        }, initialDelayMs);
    }
}