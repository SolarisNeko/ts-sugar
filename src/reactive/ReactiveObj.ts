export type OnValueChangedCallback = (fieldName: string, oldValue: any, newValue: any) => void;

export class ReactiveObj<T> {
    private target: any;
    private callback: OnValueChangedCallback;
    private proxy: T;

    constructor(data: T, callback: OnValueChangedCallback) {
        this.target = data;
        this.callback = callback;

        this.proxy = new Proxy(this.target, {
            set: (obj, prop, value) => {
                const oldValue = obj[prop];
                obj[prop] = value;
                if (oldValue !== value) {
                    this.callback(prop as string, oldValue, value);
                }
                return true;
            },
        });
    }

    getReactiveObj(): T {
        return this.proxy;
    }
}
