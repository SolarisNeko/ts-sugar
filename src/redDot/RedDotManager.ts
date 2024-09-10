import {BaseSingleton} from "../core/BaseSingleton";
import {RedDotPath} from "./structs/RedDotPath";
import {RedDotTree} from "./structs/RedDotTree";
import {RedDotShowType} from "./RedDotShowType";


/**
 * 红点管理器
 */
export class RedDotManager extends BaseSingleton {


    // state
    private _tree = new RedDotTree();

    init() {
        this._tree.init();
    }

    isFirstInitData(): boolean {
        return this._tree.isFirstInitData();
    }

    setHaveInitData() {
        this._tree.setHaveInitData();
    }

    // 注册红点
    registerRedDot(
        path: RedDotPath,
        showType: RedDotShowType = RedDotShowType.NULL,
    ) {

        this._tree.setShowTypeForPath(path, showType);
        // console.log(`[红点] 注册 path = ${path.templatePath}, showType = ${showType}`);
    }


    /**
     * 设置红点永久已读
     */
    markRedDotForeverRead(path: RedDotPath, pathArgs?: any[]) {

        this._tree.markRedDotForeverRead(path, pathArgs || []);
    }

    /**
     * 设置红点
     */
    setRedDot(path: RedDotPath, isHaveRedDot: boolean, pathArgs?: any[]) {

        // 目前只有布尔值
        const count = isHaveRedDot ? 1 : 0;
        const args = pathArgs || [];

        if (count <= 0) {
            this._tree.remove(path, args);
            return;
        }
        this._tree.set(path, count, args);
    }

    /**
     * 是否有红点
     * @param path
     * @param pathArgs
     */
    isHaveRedDot(path: RedDotPath, ...pathArgs: any[]): boolean {
        // const key = path instanceof RedDotPath ? path.render() : path;

        return this._tree.get(path, pathArgs) > 0;
    }


    /**
     * 获取显示方式
     * @param path
     * @param pathArgs
     */
    getShowType(path: RedDotPath, ...pathArgs: any[]): RedDotShowType {
        // let node: RedDotNode = this._keyToNodeMap.get(path);
        // if (!node) {
        //     //未注册
        //     console.log(`红点${path}未注册`);
        //     return RedDotShowType.NULL;
        // }
        // return RedDotShowType.NORMAL;

        return this._tree.getFirstShowTypeInChildRedDot(path, pathArgs);
    }

    printRedDotTree() {
        this._tree.printTree();
    }
}

/**
 * 红点触发器  主动调用才能触发
 * 绑定红点id
 */
export function redDotTrigger(...paths: RedDotPath[]) {
    return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
        const method = descriptor.value
        descriptor.value = function () {
            let isHaveRedDot = method.apply(this, arguments);

            for (let path of paths) {
                // RedDotManager.ins().registerRedDot(key);

                // setter
                RedDotManager.ins().setRedDot(path, isHaveRedDot);
                console.log(`[红点 @redDotTrigger] ${path} args = ${arguments}, | return value = ${isHaveRedDot}`);
            }

            return isHaveRedDot;

        }
    }
}

