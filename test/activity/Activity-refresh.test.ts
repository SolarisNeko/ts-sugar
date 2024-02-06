import {ActivityManager, ActivityTypeHandler, ActivityTypeHandlerFactory} from "../../src/activity/Activity";
import {Clazz} from "../../src/types/Types";

jest.useFakeTimers();


class MockActivityData {
}

class MockActivityTypeHandler extends ActivityTypeHandler<MockActivityData> {
    getActivityAnyDataClass(): Clazz<MockActivityData> {
        return MockActivityData;
    }
}


describe('ActivityManager', () => {
    let activityManager: ActivityManager;

    beforeEach(() => {
        activityManager = ActivityManager.instance;
        ActivityTypeHandlerFactory.instance.registerHandler('demo', new MockActivityTypeHandler());

    });

    afterEach(() => {
        // 清除所有模拟的计时器
        jest.clearAllTimers();
    });

    test('resetScheduler should set up a new scheduler', () => {
        // 模拟 resetScheduler
        const resetSchedulerSpy = jest.spyOn(activityManager as any, 'resetScheduler');

        // 调用 resetScheduler
        activityManager.resetScheduler();

        // 断言 resetScheduler 被调用了一次
        expect(resetSchedulerSpy).toHaveBeenCalledTimes(1);
    });

    test('resetScheduler should set up a new scheduler after the interval', () => {
        // 模拟 updateActivityStates
        const updateActivityStatesSpy = jest.spyOn(activityManager as any, 'updateActivityStates');

        // 调用 resetScheduler
        activityManager.resetScheduler();

        // 模拟时间过去 checkActivityIntervalMs 的一半时间
        jest.advanceTimersByTime(activityManager.checkActivityIntervalMs / 2);

        // 断言 updateActivityStates 没有被调用
        expect(updateActivityStatesSpy).not.toHaveBeenCalled();

        // 模拟时间过去 checkActivityIntervalMs 的剩余时间
        jest.advanceTimersByTime(activityManager.checkActivityIntervalMs / 2);

        // 断言 updateActivityStates 被调用了一次
        expect(updateActivityStatesSpy).toHaveBeenCalledTimes(1);
    });

    test('resetScheduler should be called after removeActivity', () => {
        // 模拟 resetScheduler
        const resetSchedulerSpy = jest.spyOn(activityManager as any, 'resetScheduler');

        // 添加活动
        activityManager.addActivity({
            activityId: 1,
            activityType: 'demo',
            startTimeMs: Date.now() - 1000,
            endTimeMs: Date.now() + 1000,
            turnCount: 1,
            displayFlag: true,
            joinFlag: true,
            data: {},
        });

        // 移除活动
        activityManager.removeActivity(1);

        // 断言 resetScheduler 被调用了一次
        expect(resetSchedulerSpy).toBeCalled();
    });
});
