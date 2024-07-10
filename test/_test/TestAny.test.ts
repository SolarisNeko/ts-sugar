class StoryText {
    private _kvMap: Map<string, string> = new Map<string, string>();
    private _dialogList: StoryOneDialogText[] = [];

    static from(input: string): StoryText {
        const storyText = new StoryText();

        storyText.resetByText(input);
        return storyText;
    }


    private resetByText(input: string) {

        const sections = input.split('@===');

        // 解析全局配置
        const globalConfigSection = sections[0];
        const globalConfigLines = globalConfigSection.split('\n');

        // 解析全局 kv 参数
        globalConfigLines.forEach(line => {
            if (line.startsWith('@')) {
                const [key, value] = line.substring(1).split('=');
                const valueText = value.trim();
                this._kvMap.set(key.trim(), valueText.trim());
            }
        });

        // 解析剧本内容
        if (sections.length > 1) {
            const scriptSection = sections[1];
            const paragraphs = scriptSection.split('@---');
            paragraphs.forEach(paragraph => {
                const input1 = paragraph.trim();
                if (input1.length == 0) {
                    return;
                }
                const storyOneDialogText = StoryOneDialogText.create(input1, this._kvMap);
                if (storyOneDialogText) {
                    this._dialogList.push(storyOneDialogText);
                }
            });
        }

    }

    get kvMap(): Map<string, any> {
        return this._kvMap;
    }

    get dialogList(): StoryOneDialogText[] {
        return this._dialogList;
    }

}

/**
 * 剧本中的单次对话文本
 */
export class StoryOneDialogText {
    // 函数名
    functionName: string = "";
    // 参数
    kvMap: Map<string, string> = new Map<string, string>();
    // 剧本中单个对话内容
    textContent: string = "";
    // 选项列表
    optionList: string[] = [];

    public static create(input: string,
                         globalKvMap: Map<string, string>
    ): StoryOneDialogText | null {
        const dialogText = new StoryOneDialogText();

        dialogText.reset(input, globalKvMap);


        return dialogText;
    }

    private reset(input: string, globalKvMap: Map<string, string>) {
        const lines = input.split('\n');
        let parsingContent = false;

        // 全局 kv 参数
        globalKvMap.forEach((value, key) => {
            this.kvMap.set(key, value);
        });

        lines.forEach(line => {
            line = line.trim();
            // 跳过注释行
            if (line.startsWith("//")) {
                return
            }
            // 参数
            if (line.startsWith('@')) {
                const [key, value] = line.substring(1).split('=');
                // 策略名
                if (key === 'type') {
                    this.functionName = value.trim();
                } else {
                    this.kvMap.set(key.trim(), value.trim());
                }
                return;
            }
            // 选项
            if (line.startsWith("-")) {
                const optionStr = line.substring(1).trim();
                this.optionList.push(optionStr);
                return;
            }

            if (line.length > 0) {
                this.textContent += line + "\n";
                parsingContent = true;
            }
        });

        this.textContent = this.textContent.trim();

        // 如果没有解析到内容，返回 null
        if (!parsingContent) {
            return null;
        }
    }
}

const STORY_TEXT = `
// 测试剧情文本格式解析

// 全剧配置部分。
// 格式 = @key=value
@key=value
@isCanSkip=true


@===
// 第 1 个句话

// 处理策略
@type=dialog

// 说话角色. 角色的配置名
@character=haer
// 说话内容
欢迎来到蒲公英城, 你现在位于海尔大陆的南侧. 

// 选项部分
- 好的
- 啊, 你是谁?

@---

@type=dialog
@character=me
你是...?

@---
`

describe('test', () => {
    test('story text', (done) => {
        const storyText = StoryText.from(STORY_TEXT);
        console.info('Global Config:', storyText.kvMap);

        for (let storyOneDialogText of storyText.dialogList) {
            console.info(storyOneDialogText);
        }
        done();
    });
});
