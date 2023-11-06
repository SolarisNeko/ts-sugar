import Logger from "../logger/Logger";
import LazySingleton from "../core/LazySingleton";

/**
 * cmd 路由
 * @author LuoHaoJun on 2023-06-20
 */
export default class CmdRouter extends LazySingleton {

    // cmd -> function callback, 只有一个 data 参数
    private readonly cmdToCallbackMap: Map<string, Function> = new Map<string, Function>();
    private readonly cmdToCallbackObjectMap: Map<string, any> = new Map<string, any>();

    // 根据 cmd: string 进行路由到对应的处理方法
    public route(cmd: string,
                 data: any
    ): void {
        // callback
        let cmdHandler: Function = this.getHandlerByCmd(cmd);
        let object: any = this.getHandlerObject(cmd);

        if (!cmdHandler) {
            Logger.error(`没有找到 cmd = ${cmd} 对应的处理方法.`);
            return;
        }

        try {
            cmdHandler.call(object, data)
        } catch (e) {
            // global exception
            Logger.error(`cmd = ${cmd} 处理的 data 执行报错. data = ${data}`)
            return;
        }
    }


    public registerHandler(cmd: string,
                           callback: Function,
                           invokeObj: any
    ): void {
        this.cmdToCallbackMap[cmd] = callback;
        this.cmdToCallbackObjectMap[cmd] = invokeObj;
    }

    public unregisterHandler(cmd: string): void {
        delete this.cmdToCallbackMap[cmd];
        delete this.cmdToCallbackObjectMap[cmd];
    }

    private getHandlerByCmd(cmd: string): Function {
        return this.cmdToCallbackMap[cmd];
    }

    private getHandlerObject(cmd: string): Function {
        return this.cmdToCallbackObjectMap[cmd];
    }
}