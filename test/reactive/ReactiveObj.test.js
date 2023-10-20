import ReactiveObj from "../../src/reactive/ReactiveObj";
describe('ReactiveObj', () => {
    it('should create a reactive object and trigger callback on property change', () => {
        const data = { count: 0 };
        let callbackTriggered = false;
        const onValueChanged = (fieldName, oldValue, newValue) => {
            callbackTriggered = true;
            expect(fieldName).toBe('count');
            expect(oldValue).toBe(0);
            expect(newValue).toBe(5);
        };
        const reactiveObj = new ReactiveObj(data, onValueChanged);
        const proxy = reactiveObj.getReactiveObj();
        proxy.count = 5;
        expect(callbackTriggered).toBe(true);
    });
    it('should not trigger callback if the property value remains the same', () => {
        const data = { count: 0 };
        let callbackTriggered = false;
        const onValueChanged = () => {
            callbackTriggered = true;
        };
        const reactiveObj = new ReactiveObj(data, onValueChanged);
        const proxy = reactiveObj.getReactiveObj();
        // Value is not changing
        proxy.count = 0;
        expect(callbackTriggered).toBe(false);
    });
});
