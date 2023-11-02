import IoC from "../../src/ioc/IoC";

describe('Component Decorator', () => {
    it('should register a class as a component', () => {
// 使用示例
        class ExampleClass {
            name: string;

            constructor(name: string) {
                this.name = name;
            }
        }

        const container = IoC.getInstance();

        const instance = new ExampleClass("Test Instance");
        container.register(ExampleClass, instance);

        const retrievedInstance = container.get(ExampleClass);

        console.log(retrievedInstance); // 输出 ExampleClass { name: 'Test Instance' }
        // expect(IOC.get('MockDependentService')).toBe(undefined);
    });
});
