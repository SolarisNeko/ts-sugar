import { Cron233 } from "../../src/cron/Cron233";

describe('Cron233', () => {

    test('获取下 n 次的 Cron 生效时间', () => {
        const cron = new Cron233("0 * * * * ?");
        const nextRuns = cron.getNextRuns(new Date(), 5);
        console.log(nextRuns);

        // 断言结果数量
        expect(nextRuns.length).toBe(5);

        // 断言结果是否为预期的时间
        nextRuns.forEach((date, index) => {
            const expectedDate = new Date();
            expectedDate.setSeconds(0);
            expectedDate.setMilliseconds(0);
            expectedDate.setMinutes(expectedDate.getMinutes() + (index + 1));

            expect(date.getTime()).toBe(expectedDate.getTime());
        });
    });

});
