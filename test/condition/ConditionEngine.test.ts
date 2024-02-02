import {
    ConditionApi,
    ConditionChecker,
    ConditionCreator,
    ConditionFactory,
    ConditionResult,
} from "../../src/condition/ConditionEngine"; // 请根据实际文件路径调整

class User {

}

class MockConditionApi implements ConditionApi {
    verify(target: any): ConditionResult {
        // Mock verification logic, always return true
        return new ConditionResult(true);
    }
}

class MockConditionCreator implements ConditionCreator {
    create(type: string, data: any): ConditionApi {
        return new MockConditionApi();
    }
}

describe('ConditionFactory', () => {

    beforeEach(() => {
        ConditionFactory.instance.register('mock', new MockConditionCreator());
    });

    test('createConditionChecker should return a valid ConditionChecker', () => {
        const jsonConfig: string = `
            {
                "checkType": "and",
                "conditionGroup": {
                    "group1": [
                        {
                            "type": "mock",
                            "data": {}
                        }
                    ],
                    "group2": [
                        {
                            "type": "mock",
                            "data": {}
                        }
                    ]
                }
            }
        `;

        const conditionChecker: ConditionChecker<number> | null = ConditionFactory.instance.createConditionChecker(
            jsonConfig);

        expect(conditionChecker).toBeDefined();
        expect(conditionChecker?.checkType).toBe('and');

        const conditionsMap = conditionChecker?.conditions;

        expect(conditionsMap).toBeDefined();
        expect(conditionsMap?.size).toBe(2);

        const group1Conditions = conditionsMap?.get('group1');
        const group2Conditions = conditionsMap?.get('group2');

        expect(group1Conditions).toBeDefined();
        expect(group1Conditions?.length).toBe(1);

        expect(group2Conditions).toBeDefined();
        expect(group2Conditions?.length).toBe(1);
    });

    test('createConditionChecker should handle invalid JSON gracefully', () => {
        const invalidJsonConfig: string = 'invalid_json_config';

        const conditionChecker: ConditionChecker<User> = ConditionFactory.instance.createConditionChecker(
            invalidJsonConfig,
            ConditionResult.fail(),
        );

        let result: ConditionResult = conditionChecker.verify(0);
        expect(result.success).toBe(false);
    });
});
