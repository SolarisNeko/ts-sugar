import {VersionControlExecutor, VersionLogic} from "../../src/core/VersionControlExecutor";

describe('VersionControlExecutor', () => {
    let versionControlExecutor: VersionControlExecutor;

    beforeEach(() => {
        versionControlExecutor = new VersionControlExecutor(0);
    });

    test('注册和执行版本逻辑', () => {
        const mockLogic1: VersionLogic = jest.fn();
        const mockLogic2: VersionLogic = jest.fn();

        versionControlExecutor.registerVersion(1, mockLogic1);
        versionControlExecutor.registerVersion(2, mockLogic2);

        const newVersion = versionControlExecutor.execute();

        expect(newVersion).toBe(2); // 最新注册的版本
        expect(mockLogic1).toHaveBeenCalled();
        expect(mockLogic2).toHaveBeenCalled();
    });

    test('移除已注册的版本逻辑', () => {
        const mockLogic1: VersionLogic = jest.fn();
        const mockLogic2: VersionLogic = jest.fn();

        versionControlExecutor.registerVersion(1, mockLogic1);
        versionControlExecutor.registerVersion(2, mockLogic2);

        versionControlExecutor.removeRegisterVersion(1);

        const newVersion = versionControlExecutor.execute();

        expect(newVersion).toBe(2); // 最新注册的版本
        expect(mockLogic1).not.toHaveBeenCalled(); // 不应执行版本 1 的逻辑
        expect(mockLogic2).toHaveBeenCalled();
    });

    test('执行到指定版本', () => {
        const mockLogic1: VersionLogic = jest.fn();
        const mockLogic2: VersionLogic = jest.fn();

        versionControlExecutor.registerVersion(1, mockLogic1);
        versionControlExecutor.registerVersion(2, mockLogic2);

        const newVersion = versionControlExecutor.execute(1);

        expect(newVersion).toBe(1); // 指定执行到的版本
        expect(mockLogic1).toHaveBeenCalled();
        expect(mockLogic2).not.toHaveBeenCalled(); // 不应执行版本 2 的逻辑
    });

    test('文本版本解析 1.0.24', () => {
        const version = "2.0.24";
        const result = VersionControlExecutor.convertStringToNumber(version);

        expect(result).toBe(2000024); // Expected numeric result for the given version
    });

    test('convertStringToNumber with custom separator', () => {
        const version = "1-0-24";
        const result = VersionControlExecutor.convertStringToNumber(version, "-");

        expect(result).toBe(1000024); // Expected numeric result for the given version with custom separator
    });

    test('convertStringToNumber with invalid input - NaN', () => {
        const version = "1.0.invalid";

        // Should throw an error due to invalid input
        expect(() => VersionControlExecutor.convertStringToNumber(version)).toThrowError();
    });
});
