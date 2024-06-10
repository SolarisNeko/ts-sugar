import {Http233Decorator} from "../../src/http/decorator/Http233Decorator";

class HttpJsonObj {
    id: number = 1
    name: string = "neko233"
}


class Demo {

    @Http233Decorator.sendHttpJsonRequestAsync()
    public testHttpDecorator(obj: HttpJsonObj): Promise<void> {
        console.debug("http 请求完成")
        return null
    }
}


describe('Http @decorator', () => {
    it('should send a GET request', async () => {


        const demo = new Demo();
        demo.testHttpDecorator(new HttpJsonObj())
    })
})
