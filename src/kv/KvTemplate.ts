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