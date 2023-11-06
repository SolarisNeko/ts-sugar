import EventCallbackHandler from "./EventCallbackHandler";

/**
 * @author LuoHaoJun on 2023-06-19
 */
export default class EventCenter {

    // callback
    private static callbackMap = new Map<string, EventCallbackHandler>();

    static register(eventName: string,
                    callback: Function,
                    self: any,
                    isOnce: boolean = false
    ) {
        this.callbackMap[eventName] = {
            callback: callback,
            self: self,
            isOnce: isOnce
        };
    }


    static unregister(eventName: string) {
        this.callbackMap.delete(eventName);
    }

    static postSync(eventName: string,
                    data?: any
    ) {
        // 结构
        let callbackDto: EventCallbackHandler = this.callbackMap[eventName];

        let callback = callbackDto.callback;
        let self = callbackDto.self;

        callback.call(self, data);

        // 一次性
        if (callbackDto.isOnce) {
            this.unregister(eventName);
        }
    }

    static async postAsync(eventName: string,
                           data?: any
    ) {
        // 结构
        let callbackDto: EventCallbackHandler = this.callbackMap[eventName];

        let callback = callbackDto.callback;
        let self = callbackDto.self;

        callback.call(self, data);

        // 一次性
        if (callbackDto.isOnce) {
            this.unregister(eventName);
        }
    }


}