/**
 * 版本逻辑
 */
export type VersionLogic = () => void;

/**
 * 版本控制执行器
 */
export class VersionControlExecutor {
    // 我的版本
    private myVersion: number = 0;
    private maxVersion: number = 0;
    private versionMap: Map<number, VersionLogic> = new Map();

    constructor(myVersion: number) {
        this.myVersion = myVersion;
    }

    /**
     * 提供一个静态方法，将字符串版本号转换为数字
     */
    static convertStringToNumber(version: string, separator: string = "."): number {
        const parts = version.split(separator)
            .map(part => parseInt(part, 10));

        if (parts.some(part => isNaN(part) || part < 0 || part > 999)) {
            throw new Error(`illegal string version = ${version}. single value is in [0, 999]`);
        }

        const [big, middle, small] = parts;

        // big = 1000 * 1000
        // middle = 1000
        return big * 1000000 + middle * 1000 + small;
    }

    /**
     * 注册版本号和对应的逻辑
     */
    registerVersion(version: number, logic: VersionLogic): void {
        this.versionMap.set(version, logic);
        if (version > this.maxVersion) {
            this.maxVersion = version;
        }
    }

    /**
     * 移除已注册的版本逻辑
     */
    removeRegisterVersion(version: number): void {
        this.versionMap.delete(version);
    }

    /**
     * 执行版本逻辑，直到指定的版本号
     */
    execute(inputEndVersion: number = 0): number {
        let endVersion = this.maxVersion;
        if (inputEndVersion > 0) {
            endVersion = inputEndVersion;
        }

        let newVersion = this.myVersion;
        // 遍历小于等于当前版本的版本号
        for (const [version, logic] of this.versionMap.entries()) {
            if (newVersion > endVersion) {
                break;
            }
            if (version <= endVersion) {
                // 执行指定版本的逻辑
                logic();
                // 更新新版本号
                newVersion = version;
            }
        }

        return newVersion;
    }
}
