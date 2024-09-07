import {RedDotManager} from "../RedDotManager";
import {KvTemplate} from "../../kv/KvTemplate";
import {RedDotShowType} from "../RedDotShowType";

/**
 * 红点路径
 */
export class RedDotPath {


    // 路径模板 | 动态参数格式 = ${key0}
    private _templatePath: string = "";
    private _showType: RedDotShowType = RedDotShowType.NULL;

    private static _templateToPathMap: Map<string, RedDotPath> = new Map();

    static create(template: string,
                  showType: RedDotShowType = RedDotShowType.NORMAL
    ): RedDotPath {
        const path = new RedDotPath();
        if (!template.startsWith("/")) {
            console.error(`[红点] 路径格式有问题. 必须是 /dir/name/\${key0} 这种格式 | \${key0} = 数组[0] 的动态参数 `);
            return path;
        }


        path._templatePath = template;
        path._showType = showType;

        this._templateToPathMap.set(template, path);

        // register
        RedDotManager.ins().registerRedDot(path, showType);

        return path;
    }

    /**
     * 模板路径
     * @param template
     */
    static fromTemplatePath(template: string): RedDotPath | null {
        return this._templateToPathMap.get(template);
    }


    get templatePath(): string {
        return this._templatePath;
    }

    get showType(): RedDotShowType {
        return this._showType;
    }

    /**
     * 渲染路径
     * @param args
     */
    render(...args: string[]): string {
        const kvTemplate = KvTemplate.create(this._templatePath);
        if (args) {
            for (let i = 0; i < args.length; i++) {
                kvTemplate.put(`key${i}`, args[i]);
            }
        }
        return kvTemplate
            .render();
    }

}