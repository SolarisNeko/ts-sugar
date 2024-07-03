
import {StringUtils} from "../utils/StringUtils";
import {BaseAttrTree} from "./BaseAttrTree";


export interface IAttrTreePath {

    getAttrPathString(): string;
}


/**
 * 属性树路径
 */
export class AttrTreePath implements IAttrTreePath {

    // 前缀路径
    private readonly _prefixPath: string
    // 参数
    private _args: string[] = [];

    private constructor(prefixPath: string, args: string[]) {
        this._prefixPath = prefixPath
        this._args = args;
    }

    /**
     * 创建属性槽位路径
     * @param prefixPath
     * @param args
     */
    static create(prefixPath: string, ...args: any): AttrTreePath {
        let argsStr = [...args].map(it => it?.toString() || "");
        return new AttrTreePath(prefixPath, argsStr)
    }

    getAttrPathString(): string {
        return this._prefixPath + this.getSuffixPath()
    }


    private getSuffixPath(): string {
        let path = "";
        if (this._args.length === 0) {
            return "";
        }
        this._args.forEach(item => {
            if (StringUtils.isBlank(item)) {
                return;
            }
            // demo = "/equip/1"
            path += BaseAttrTree.SPLIT + item.toString()
        });
        return path;
    }
}