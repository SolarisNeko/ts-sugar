/**
 * kv 文本模板
 * 将 ${key} 替换为 value
 *
 * @author luohaojun
 */
export class KvTemplate {
    // 模板
    readonly template: string;
    // key-value 映射
    readonly kvMap: Map<string, string> = new Map();

    private constructor(template: string, kvMap: Map<string, any>) {
        this.template = template;
        if (kvMap) {
            this.kvMap = kvMap.toDataStream()
                .toMap(
                    (item) => item.key,
                    (item) => {
                        if (item.value) {
                            return item.value.toString()
                        }
                        return "null"
                    }
                );
        }
    }

    /**
     * 创建模板
     * @param template
     * @param kvMap
     */
    static create(template: string,
                  kvMap: Map<string, any> = null
    ): KvTemplate {
        return new KvTemplate(template, kvMap);
    }

    static createByObject(template: string,
                          obj: any
    ): KvTemplate {
        const map = new Map<string, any>();
        if (obj) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    map.set(key, obj[key]);
                }
            }
        }
        return new KvTemplate(template, map);
    }

    put(key: string, value: any) {
        if (value) {
            this.kvMap.set(key, value.toString())
        } else {
            this.kvMap.set(key, "null")
        }
    }

    putAll(map: Map<string, any>) {
        if (!map) {
            return;
        }

        for (const [key, value] of map) {
            this.put(key, value);
        }
    }

    /**
     * 对象当 Map
     * @param obj
     */
    putObj(obj: any) {
        if (!obj) {
            return;
        }
        const map = new Map();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                this.put(key, value)
            }
        }
    }


    /**
     * 自动识别 key, 手动转为 value
     * @param keyToValue
     */
    replaceKey(keyToValue: (key: string) => string): KvTemplate {
        if (!keyToValue) {
            return this;
        }

        // 使用正则表达式匹配出所有的 ${xxx} 模板变量
        const regex = /\$\{(.*?)\}/g;

        // 遍历模板中的所有匹配项
        let matchArray: Array<string>;
        while ((matchArray = regex.exec(this.template)) !== null) {
            // 原始的 key, 即 ${xxx} 中的 xxx
            const keyName: string = matchArray[1];
            // 使用转换函数处理 key
            const value = keyToValue(keyName);

            this.kvMap.set(keyName, value);
        }

        return this;
    }

    /**
     * 删除 key
     * @param key
     */
    remove(key: string) {
        this.kvMap.delete(key);
    }

    // 渲染模板
    render(): string {
        // 替换 ${key}
        return this.template.replace(/\$\{(\w+)\}/g, (match, key) => {
            return this.kvMap.get(key) || '';
        });
    }
}