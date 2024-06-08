import {Http233Decorator} from "../../src/http/decorator/Http233Decorator";

class HttpJsonObj {
    id: number = 1
    name: string = "neko233"
}


class Demo {

    @Http233Decorator.SendHttpJsonRequest()
    public testHttpDecorator(obj: HttpJsonObj) {
        console.debug("http 请求完成")
    }
}


describe('Http @decorator', () => {
    it('should send a GET request', async () => {


        const demo = new Demo();
        demo.testHttpDecorator(new HttpJsonObj())
    })
})
