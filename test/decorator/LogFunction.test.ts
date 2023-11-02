// 导入你的 @LogDecorator 注解和类


// 使用注解
import LogDecorator from "../../src/logger/LogDecorator";

class MyClass {
    @LogDecorator
    add(a: number, b: number): number {
        return a + b;
    }
}

describe('@LogDecorator', () => {
    it('should logger function call with class name', () => {
        const myInstance = new MyClass();

        // 用 Jest 的 spy 来监视 console.logger 函数
        const consoleSpy = jest.spyOn(console, 'log');

        myInstance.add(2, 3);

        // 验证 console.logger 是否被调用，并检查日志输出
        expect(consoleSpy).toHaveBeenCalledTimes(1); // 只有一个console.log输出
        expect(consoleSpy).toHaveBeenCalledWith('Class: MyClass, Function: add, Parameters: [2,3], Return Value: 5');
    });
});
