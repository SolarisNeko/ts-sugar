export default class ReactiveObj {
    constructor(data, callback) {
        this.target = data;
        this.callback = callback;
        this.proxy = new Proxy(this.target, {
            set: (obj, prop, value) => {
                const oldValue = obj[prop];
                obj[prop] = value;
                if (oldValue !== value) {
                    this.callback(prop, oldValue, value);
                }
                return true;
            },
        });
    }
    getReactiveObj() {
        return this.proxy;
    }
}
