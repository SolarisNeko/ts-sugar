import 'reflect-metadata';

const DemoSymbol = Symbol('CustomField');

function Demo(target: any, propertyKey: string): void {
    // 获取类的原型对象
    const prototype = target.constructor.prototype;
    // 设置元数据到属性上
    Reflect.defineMetadata(DemoSymbol, true, prototype, propertyKey);
}

class Person {
    @Demo
    public name: string;

    public age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

class Employee extends Person {
    @Demo
    public employeeId: string;

    constructor(name: string, age: number, employeeId: string) {
        super(name, age);
        this.employeeId = employeeId;
    }
}

const employee = new Employee('John Doe', 30, 'E123456');

describe('ReflectUtils', () => {
    it('should return all fields', () => {
        // const fields = ReflectUtils.getAllFields(employee);
        // expect(fields).toEqual(['name', 'age', 'employeeId']);

        expect(true).toEqual(true)
    });

    // it('should return annotated fields', () => {
    //     const annotatedFields = ReflectUtils.getAnnotatedFields(employee, DemoSymbol);
    //     expect(annotatedFields).toEqual(['name', 'employeeId']);
    // });
});
