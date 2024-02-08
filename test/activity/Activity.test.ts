import {
    ActivityInfo,
    ActivityManager,
    ActivityPhaseEnum,
    ActivityTypeHandler,
    ActivityTypeHandlerFactory,
} from "../../src/activity/Activity";
import {Clazz} from "../../src/types/Types";

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
    });

    test('Add and Remove Activity', () => {
        const activityInfo: ActivityInfo = {
            activityId: 1,
            activityType: 'TestActivity',
            startTimeMs: Date.now(),
            endTimeMs: Date.now() + 1000,
            turnCount: 1,
            displayFlag: true,
            joinFlag: true,
            data: {},
        };

        const mockHandler = new MockActivityTypeHandler();
        ActivityTypeHandlerFactory.instance.registerHandler('TestActivity', mockHandler);

        // Add activity
        activityManager.addActivity(activityInfo);
        expect(activityManager.getAllActivityStateData().length).toBe(1);

        // Remove activity
        activityManager.removeActivity(activityInfo.activityId);
        expect(activityManager.getAllActivityStateData().length).toBe(0);
    });

    test('Get Activity State Data', () => {
        const activityInfo: ActivityInfo = {
            activityId: 2,
            activityType: 'AnotherTestActivity',
            startTimeMs: Date.now(),
            endTimeMs: Date.now() + 1000,
            turnCount: 1,
            displayFlag: true,
            joinFlag: true,
            data: {},
        };

        const mockHandler = new MockActivityTypeHandler();
        ActivityTypeHandlerFactory.instance.registerHandler('AnotherTestActivity', mockHandler);

        activityManager.addActivity(activityInfo);

        // Get activity state data
        const activityStateData = activityManager.getActivityStateData(activityInfo.activityId);
        expect(activityStateData).toBeDefined();
        expect(activityStateData?.activityId).toBe(activityInfo.activityId);
        expect(activityStateData?.activityType).toBe(activityInfo.activityType);
        expect(activityStateData?.phase).toBe(ActivityPhaseEnum.Join);
        // Add more assertions based on your expected behavior
    });

    // Add more tests as needed based on your specific requirements
});
