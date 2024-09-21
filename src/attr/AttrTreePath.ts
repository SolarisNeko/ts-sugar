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
     * create 属性树路径
     * @param prefixPath
     * @param args
     */
    static create(prefixPath: string, ...args: any): AttrTreePath {
        let argsStr = [...args].map(it => it?.toString() || "");
        return new AttrTreePath(prefixPath, argsStr)
    }

    /**
     * 获取属性书路径
     */
    getAttrPathString(): string {
        return this._prefixPath + this.getArgsPath()
    }


    /**
     * 参数路径
     * @private
     */
    private getArgsPath(): string {
        if (this._args.length === 0) {
            return "";
        }

        return BaseAttrTree.SPLIT + this._args.join(BaseAttrTree.SPLIT);
    }
}