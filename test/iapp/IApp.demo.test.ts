import {AbstractApp, AbstractComponent, IocContainer} from "../../src/iapp/IApp";
import * as Stream from "stream";
import {HashMap} from "../../src/dataStruct/HashMap";

class KvComponent extends AbstractComponent {

    public kvMap : HashMap<String, any> = new HashMap()

}

class DemoApp extends AbstractApp {


    protected init(): void {
        this.registerComponentByClazz(KvComponent)
    }

}

describe('IApp.demo.test.ts', () => {

    test("demo", () => {
        let demoApp = new DemoApp("DemoApp");
        demoApp.run();

        let kvComponent = demoApp.getComponent(KvComponent);

        kvComponent.kvMap.put("demo", 1)

        let v = kvComponent.kvMap.get("demo");
        console.log(`demo = ${v}`)



    })

});