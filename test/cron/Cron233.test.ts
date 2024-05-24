import {Cron233} from "../../src/cron/Cron233";


// Cron233 单元测试
describe('Cron233', () => {
    let cron: Cron233;

    // 初始化测试对象
    beforeEach(() => {
        cron = new Cron233();
    });

    // 测试设置和获取 cron 表达式
    test('should set and get cron expression', () => {
        const cronExpression = '0 0 12 * * ?';
        cron.setCron(cronExpression);
        expect(cron.getSeconds()).toBe('0');
        expect(cron.getMinutes()).toBe('0');
        expect(cron.getHours()).toBe('12');
        expect(cron.getDayOfMonth()).toBe('*');
        expect(cron.getMonth()).toBe('*');
        expect(cron.getDayOfWeek()).toBe('?');
    });

    // 测试验证有效的 cron 表达式
    test('should validate correct cron expression', () => {
        cron.setCron('0 0 12 * * ?');
        expect(cron.validate()).toBe(true);
    });

    // 测试验证无效的 cron 表达式
    test('should invalidate incorrect cron expression', () => {
        cron.setCron('0 0 12 32 * ?');
        expect(cron.validate()).toBe(false);
    });

    // 测试无效的 cron 表达式长度
    test('should throw error for invalid cron expression length', () => {
        expect(() => {
            cron.setCron('0 0 12 * *');
        }).toThrow('Invalid cron expression. It must have 6 parts.');
    });

    // 测试无效的 cron 表达式字符
    test('should invalidate cron expression with invalid characters', () => {
        cron.setCron('0 0 12 * * *A');
        expect(cron.validate()).toBe(false);
    });

    // 测试计算未来第 n 次的执行时间
    test('should calculate next run times correctly', () => {
        // 每周二, 中午 12:00 执行
        cron.setCron('0 0 12 * * 2');
        const currentEpochTimeMs = new Date('2024-05-24T00:00:00Z').getTime();
        const nextRuns = cron.calculateNextRun(currentEpochTimeMs, 3);

        expect(nextRuns.length).toBe(3);
        expect(new Date(nextRuns[0]).toISOString()).toBe('2024-05-28T12:00:00.000Z');
        expect(new Date(nextRuns[1]).toISOString()).toBe('2024-06-04T12:00:00.000Z');
        expect(new Date(nextRuns[2]).toISOString()).toBe('2024-06-11T12:00:00.000Z');
    });
});
