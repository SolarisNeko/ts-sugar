import {RedDotPath} from "./RedDotPath";
import {RedDotShowType} from "../RedDotShowType";
import {LocalStorageUtils} from "../../utils/LocalStorageUtils";
import {RedDotStorageKeys} from "../RedDotStorageKeys";
import {IRedDotForeverReadDto} from "../dto/IRedDotForeverReadDto";
import {IRedDotHistoryDto} from "../dto/IRedDotHistoryDto";
import {ArrayUtils} from "../../utils/ArrayUtils";
import {RedDotUtils} from "../utils/RedDotUtils";
import {MapUtils} from "../../utils/MapUtils";
import {ClipboardUtils} from "../../utils/CopyboardUtils";

/**
 * 红点树
 */
export class RedDotTree {

    private version: string = "0.0.2";

    // state
    //  <路径, <参数[], 红点数量>> | 红点数据
    private _pathToArgNameToRedDotCountMap: Map<RedDotPath, Map<string, number>> = new Map();
    //  <路径, <参数, 红点永久已读>> 
    private _pathToArgNameToIsForeverReadMap: Map<RedDotPath, Map<string, boolean>> = new Map();
    // <子路径, 是否不再参与父路径聚合红点?> | 子路径有红点, 但是父路径不再有红点
    private _pathToNotJoinParentFlagMap: Map<RedDotPath, boolean> = new Map();

    // config
    // 路径模板 -> 显示方式
    private _pathToShowTypeMap: Map<RedDotPath, RedDotShowType> = new Map();

    // dependency
    // <路径, 覆盖到的子路径[]> | 依赖关系
    private _pathToChildPathMap: Map<RedDotPath, RedDotPath[]> = new Map();


    private _isDirty: boolean = false;

    // 是否初始化
    private _isFirstInit: boolean = true;

    init() {
        console.info("[红点] 全自动分析依赖关系 start");

        // 先清空 
        this._pathToChildPathMap.clear();

        // 获取所有注册的 RedDotPath
        const redDotPaths: IterableIterator<RedDotPath> = this._pathToShowTypeMap.keys();
        // 遍历每个路径模板，找到其对应的子路径
        const pathArray = Array.from(redDotPaths);
        for (const parentPath of pathArray) {
            const childPaths: RedDotPath[] = [];

            // 遍历所有其他路径，检查哪些是当前路径的子路径
            for (const potentialChildPath of pathArray) {
                if (this._isChildPath(parentPath, potentialChildPath)) {
                    childPaths.push(potentialChildPath);
                }
            }

            if (childPaths.length <= 0) {
                continue;
            }
            // 保存父路径与其对应的子路径
            this._pathToChildPathMap.set(parentPath, childPaths);
        }

        console.info("[红点] 全自动分析依赖关系 end");


        // print 
        // if (DebugUtils.isDebug()) {
        console.info("-------------- 红点依赖关系 -------------- ");
        for (let [parentPath, allChildPaths] of this._pathToChildPathMap) {
            console.info(`[红点] path = ${parentPath.templatePath} `);
            allChildPaths.forEach(it => console.info(`- ${it.templatePath}`))
        }

        console.info("-------------- /红点依赖关系 -------------- ");
        // }


        //
        // GameUtils.onGameExit(() => {
        //
        //     this.saveToLocalStorage();
        // });

        const isRestoreData = this.restoreHistoryData();
        this._isFirstInit = !isRestoreData;

        setInterval(() => {
            this.saveToLocalStorage();
        }, 5000);
    }


    // 保存到本地
    saveToLocalStorage() {
        if (!this._isDirty) {
            return;
        }
        this._isDirty = false;

        console.info("保存历史红点数据 start");

        LocalStorageUtils.set(RedDotStorageKeys.redDotVersion, this.version);
        // data
        const redDotDataArray = [];
        for (let [path, argMap] of this._pathToArgNameToRedDotCountMap) {
            for (let [argName, count] of argMap) {


                redDotDataArray.push({
                    template: path.templatePath,
                    argsName: argName,
                    count: count,
                } as IRedDotHistoryDto)
            }
        }
        LocalStorageUtils.set(RedDotStorageKeys.redDotData, redDotDataArray);


        // read settings
        const foreverReadArray = new Array<IRedDotForeverReadDto>();
        for (let [path, argMap] of this._pathToArgNameToIsForeverReadMap) {
            for (let [argName, isRead] of argMap) {
                if (isRead == null) {
                    continue;
                }

                foreverReadArray.push({
                    template: path.templatePath,
                    argsName: argName,
                    isForeverRead: isRead,
                } as IRedDotForeverReadDto);
            }
        }
        LocalStorageUtils.set(RedDotStorageKeys.redDotForeverReadData, foreverReadArray);


        console.info("保存历史红点数据 end");
    }

    /**
     * 恢复数据
     */
    restoreHistoryData(): boolean {

        const oldVersion = LocalStorageUtils.get(RedDotStorageKeys.redDotVersion, String);

        // 版本不一致, 不再用旧数据
        if (oldVersion != this.version) {
            console.info("【红点】 数据版本变更. 历史数据废弃!");

            // 清空历史数据
            LocalStorageUtils.set(RedDotStorageKeys.redDotData, null);
            LocalStorageUtils.set(RedDotStorageKeys.redDotForeverReadData, null);


            return false;
        }


        console.info("[红点] 恢复历史红点数据 start ");

        // forever read
        const readForeverDataArray = LocalStorageUtils.get(RedDotStorageKeys.redDotForeverReadData, Array<IRedDotForeverReadDto>);
        if (ArrayUtils.isNotEmpty(readForeverDataArray)) {
            for (let data of readForeverDataArray) {
                const path = RedDotPath.fromTemplatePath(data.template);
                if (!path) {
                    continue;
                }

                const map = this._pathToArgNameToIsForeverReadMap.getOrCreate(path, () => new Map());
                const argsName = data.argsName;
                const isForeverRead = data.isForeverRead;
                map.set(argsName, isForeverRead);
            }
        }


        // 恢复数据
        // const array = LocalStorageUtils.get(RedDotStorageKeys.redDotData, Array<IRedDotHistoryDto>);
        // if (ArrayUtils.isNotEmpty(array)) {
        //     // data
        //     for (let data of array) {
        //         const path = RedDotPath.fromTemplatePath(data.template);
        //         if (!path) {
        //             continue;
        //         }
        //
        //         const map = this._pathToArgNameToRedDotCountMap.getOrCreate(path, () => new Map());
        //         const argsName = data.argsName;
        //
        //         // 已读
        //         const isForeverRead = this.isRedDotForeverRead0(path, argsName);
        //         if (isForeverRead) {
        //             continue;
        //         }
        //
        //         const count = data.count;
        //         if (count <= 0) {
        //             continue;
        //         }
        //         map.set(argsName, count);
        //     }
        // }


        console.info("[红点] 恢复历史红点数据 end ");


        return true;
    }

    isFirstInitData(): boolean {
        return this._isFirstInit;
    }

    setHaveInitData() {
        this._isFirstInit = true;
    }

    private _getArgsName(args: any[]): string {
        return args.map(it => it.toString()).join("|");
    }

// 判断某个路径是否是另一个路径的子路径
    private _isChildPath(parentPath: RedDotPath, childPath: RedDotPath): boolean {
        // 通过比较两个 RedDotPath 的模板字符串来判断是否是子路径关系
        return childPath.templatePath.startsWith(parentPath.templatePath) && childPath !== parentPath;
    }

    markDirty(path: RedDotPath, args: any[]): void {
        this._isDirty = true;

        const eventName = RedDotUtils.createUniqueEventName(path, args);

        // event
        this.sendEvent(eventName);


        // 父事件
        // Recursively emit parent events
        this._emitParentEvents(eventName);
    }

    /**
     * 递归发射父路径 event
     * @param eventName
     * @private
     */
    private _emitParentEvents(eventName: string): void {
        let lastSlashIndex = eventName.lastIndexOf('/');

        while (lastSlashIndex > 0) {
            const parentEventName = eventName.substring(0, lastSlashIndex);

            // 发射 event
            this.sendEvent(parentEventName);

            lastSlashIndex = parentEventName.lastIndexOf('/');
        }
    }

    sendEvent(eventName: string): void {
        // TODO
        // FacadeManager.ins().emit(eventName);
    }

    // 添加红点
    add(path: RedDotPath, count: number, args: any[]): void {
        const argsName = this._getArgsName(args);

        // 永久已读, 则再也不处理
        const isForeverRead = this.isRedDotForeverRead(path, args);
        if (isForeverRead) {
            return;
        }

        let paramsMap = this._pathToArgNameToRedDotCountMap.get(path);
        if (!paramsMap) {
            paramsMap = new Map();
            this._pathToArgNameToRedDotCountMap.set(path, paramsMap);
        }

        const currentCount = paramsMap.get(argsName) || 0;
        paramsMap.set(argsName, currentCount + count);

        this.markDirty(path, args);
    }

    // 减少红点
    minus(path: RedDotPath, count: number, args: any[]): void {
        this.add(path, -count, args);
    }

    // 设置红点
    set(path: RedDotPath, count: number, args: any[]): void {
        const argsName = this._getArgsName(args);

        // filter
        const isForeverRead = this.isRedDotForeverRead(path, args);
        if (isForeverRead) {
            // 永久已读, 则再也不处理
            return;
        }

        // set
        let paramsMap = this._pathToArgNameToRedDotCountMap.getOrCreate(path, () => new Map<string, number>());
        const value = Math.max(0, count);

        const oldValue = paramsMap.get(argsName);
        if (oldValue == value) {
            return;
        }

        if (value > 0) {
            paramsMap.set(argsName, value);
        } else {
            paramsMap.delete(argsName);
        }

        console.info(`[红点] add. path = ${path.templatePath}, args = ${argsName}, value = ${value}`);

        this.markDirty(path, args);

    }

    // 移除红点
    remove(path: RedDotPath, args: any[]): void {
        const argsName = this._getArgsName(args);

        const paramsMap = this._pathToArgNameToRedDotCountMap.get(path);
        if (!paramsMap) {
            return;
        }
        paramsMap.delete(argsName);

        this.markDirty(path, args);
    }

// 获取红点值，包括所有子路径的聚合
    get(path: RedDotPath, args: any[]): number {
        const argsName = this._getArgsName(args);

        // 获取当前路径的红点数
        let total = this._getRedDotCountForPath(path, argsName);

        // 获取子路径，并递归计算它们的红点数
        const childPaths = this._pathToChildPathMap.get(path);
        if (childPaths) {
            for (const childPath of childPaths) {
                total += this._getRedDotCountForPath(childPath, argsName);  // 递归获取子路径的红点数
            }
        }

        return total;
    }

// Helper method to get the red dot count for a specific path and args
    private _getRedDotCountForPath(path: RedDotPath, argsName: string): number {
        const nameToCountMap = this._pathToArgNameToRedDotCountMap.get(path);
        if (!nameToCountMap) {
            return 0;
        }

        let total = 0;
        for (const [otherName, value] of nameToCountMap) {
            if (this._isSubPath(argsName, otherName)) {
                total += value;
            }
        }

        return total;
    }


    // 判断子路径参数是否匹配
    private _isSubPath(parentArgsName: string, childArgs: string): boolean {
        return childArgs.startsWith(parentArgsName);
    }

    // 设置显示方式 for 路径
    setShowTypeForPath(path: RedDotPath, showType: RedDotShowType) {
        this._pathToShowTypeMap.set(path, showType);
    }

    /**
     * 获取第一个显示方式 by 子路径驱动
     * @param path
     * @param args
     */
    getFirstShowTypeInChildRedDot(path: RedDotPath, args: any[]): RedDotShowType {
        return this.getAllShowTypeOrChildPathShowType(path, args)[0] || RedDotShowType.NULL;
    }

    // 获取当前路径的 showType 或其有红点的子路径的所有 showType
    getAllShowTypeOrChildPathShowType(path: RedDotPath, args: any[]): RedDotShowType[] {

        const paramsToCntMap = this._pathToArgNameToRedDotCountMap.get(path);
        if (MapUtils.isNotEmpty(paramsToCntMap)) {
            const argsName = this._getArgsName(args);
            const count = paramsToCntMap.get(argsName);
            // 如果当前路径, 有, 就直接用
            if (count > 0) {
                return [path.showType];
            }

            // 否则, 冒泡使用子路径的红点
        }

        // 子路径
        const childPaths = this._pathToChildPathMap.get(path);
        if (!childPaths) {
            // 没有子路径
            return [];
        }

        const showTypeArray: RedDotShowType[] = [];
        for (let childPath of childPaths) {
            const paramsToCntMap = this._pathToArgNameToRedDotCountMap.get(childPath);
            if (MapUtils.isEmpty(paramsToCntMap)) {
                continue;
            }

            // 子路径有红点! 用作显示
            const showType = this._pathToShowTypeMap.get(childPath);
            if (!showType) {
                continue;
            }
            showTypeArray.push(showType);
        }

        return showTypeArray;
    }

    printTree() {
        let log = "----------------------- RedDotTree ---------------------------\n";
        this._pathToArgNameToRedDotCountMap.forEach((paramsMap, path) => {
            log += `path = ${path.templatePath} \n`;
            let count = 1;
            paramsMap.forEach((count, argsName) => {
                log += `${count} | ${argsName} = ${count} \n`;
                count++;
            });

            log += "\n---------------------------\n";
        });

        log += "----------------------- RedDotTree ---------------------------\n";

        console.info(log);


        ClipboardUtils.copy(log);
    }

    /**
     * 是否永久已读 ?
     * @param path
     * @param args
     */
    isRedDotForeverRead(path: RedDotPath, args: any[]): boolean {
        const argsName = this._getArgsName(args);

        return this.isRedDotForeverRead0(path, argsName);
    }

    private isRedDotForeverRead0(path: RedDotPath, argsName: string) {
        const nameToIsReadMap = this._pathToArgNameToIsForeverReadMap.getOrCreate(path, () => new Map());
        return nameToIsReadMap.get(argsName) == true;
    }

    /**
     * 标记这个红点永久已读
     * @param path
     * @param args
     */
    markRedDotForeverRead(path: RedDotPath, args: any[]) {
        const argsName = this._getArgsName(args);

        // 永久已读
        const map = this._pathToArgNameToIsForeverReadMap.getOrCreate(path, () => new Map());
        map.set(argsName, true);

        console.info(`[红点] 永久已读. path = ${path.templatePath}, args = ${argsName}`);


        // 并且删除红点
        this.remove(path, args);
    }
}
