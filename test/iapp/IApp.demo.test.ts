import {AbstractApp, AbstractComponent, EventHandler} from "../../src/iapp/IApp";
import {HashMap} from "../../src/collection/HashMap";
import {DemoCommand, DemoEvent, DemoQuery} from "./mock/IAppDemoData";

class KvComponent extends AbstractComponent {

    public kvMap: HashMap<String, any> = new HashMap()

}

class DemoApp extends AbstractApp {

    protected init(): void {
        // component
        this.registerComponentByClazz(KvComponent)


        // event handler
        let IUnRegister = this.registerEventHandler(
            new EventHandler(
                DemoEvent,
                (e) => {
                    e.count = 1
                },
                false
            ));
    }

}

describe('IApp.demo.test.ts', () => {

    test("demo", () => {
        // app run !
        let demoApp = new DemoApp("DemoApp");
        demoApp.run();

        // component
        let kvComponent = demoApp.getComponent(KvComponent);
        kvComponent.kvMap.put("demo", 1)

        let v = kvComponent.kvMap.get("demo");
        expect(v === 1).toBe(true)


        // command
        let command = new DemoCommand();
        demoApp.executeQuery(command);
        expect(command.count === 1).toBe(true)

        // query
        let count = demoApp.executeQuery(new DemoQuery());
        expect(count === 1).toBe(true)

        // event
        let demoEvent = new DemoEvent();
        demoApp.sendEvent(demoEvent);
        expect(demoEvent.count === 1).toBe(true)


    })

});