/**
 * 异步工具类
 */
export default class ActionChain {
    /**
     * 序列化执行
     * @param actionArray 函数队列, Action 不一定要全部参数(JS 特性)
     * @returns
     */
    static serialize(...actionArray) {
        if (null == actionArray ||
            actionArray.length <= 0) {
            return;
        }
        // temp function
        let ok = function () {
            if (actionArray.length <= 0) {
                return;
            }
            // = Java Queue pop
            let action = actionArray.shift();
            if (action == undefined) {
                return;
            }
            if ("function" != typeof (action)) {
                ok();
                return;
            }
            action(ok);
        };
        // 递归入口
        ok();
    }
}
