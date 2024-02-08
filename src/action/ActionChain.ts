/**
 * 【生命周期】.
 * 通过方法, 控制 Lifecycle 是否走下一个
 * 相当于 Promise.resolve
 */
export type OkAction = () => void;

/**
 * Lambda, 提供一个 yes 
 */
export type Action = (ok: OkAction) => void;

/**
 * 异步工具类
 */
export class ActionChain {

  /**
   * 序列化执行
   * @param actionArray 函数队列, Action 不一定要全部参数(JS 特性)
   * @returns 
   */
  static serialize(...actionArray: Array<Action>): void {
    if (null == actionArray ||
      actionArray.length <= 0) {
      return;
    }

    // temp function
    let ok = function (): void {
      if (actionArray.length <= 0) {
        return;
      }
      // = Java Queue pop
      let action: Action | undefined = actionArray.shift();
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