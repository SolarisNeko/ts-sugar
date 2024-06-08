import {Inject233, Ioc233, Provider233} from "../../src/ioc/Ioc233";


@Provider233()
class TestUseService {

    hello() {
        console.log("hello world");
    }
}

@Provider233()

class MyComponent {

    @Inject233(TestUseService)
    private userService!: TestUseService;

    testHello() {
        this.userService.hello();

        console.info("MyComponent hello1")
    }
}

@Provider233()
class MyComponent2 {

    @Inject233(MyComponent)
    private service!: MyComponent;

    testHello() {
        this.service.testHello();
    }
}


describe('IApp.demo.test.ts', () => {
    test("demo", () => {

        // 使用组件
        const component = Ioc233.getObject(MyComponent2);

        // 调用服务方法
        component.testHello(); // 应该会正确打印 "hello world"
    });
});

