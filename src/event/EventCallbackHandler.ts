export default class EventCallbackHandler {

    // 回调的函数
    callback: Function;

    // this 指针
    self: any;

    // is 一次性 ?
    isOnce: boolean = false

}