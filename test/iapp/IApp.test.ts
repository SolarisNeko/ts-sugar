import {AbstractComponent, EventHandler, IocContainer, EventSystemByClazz,} from '../../src/iapp/IApp';


describe('IocContainer.ts', () => {
    let container: IocContainer;

    beforeEach(() => {
        container = new IocContainer();
    });

    test('register and get', () => {
        class TestComponent extends AbstractComponent {
            init(): void {
            }
        }

        const instance = new TestComponent();
        container.registerByClass(TestComponent, instance);

        const retrievedInstance = container.getByClass(TestComponent);
        expect(retrievedInstance).toBe(instance);
    });

    test('register duplicate class', () => {
        class TestComponent extends AbstractComponent {

            init(): void {
            }
        }

        const instance1 = new TestComponent();
        const instance2 = new TestComponent();
        container.registerByClass(TestComponent, instance1);

        expect(() => container.registerByClass(TestComponent, instance2)).toThrowError(
            `Class ${TestComponent.name} is already registered in the IoC container.`,
        );
    });

    test('get non-registered class', () => {
        class TestComponent extends AbstractComponent {
            init(): void {
            }
        }

        const retrievedInstance = container.getByClass(TestComponent);
        expect(retrievedInstance).toBeNull();
    });

    test('remove', () => {
        class TestComponent extends AbstractComponent {
            init(): void {
            }
        }

        const instance = new TestComponent();
        container.registerByClass(TestComponent, instance);

        const retrievedInstance = container.getByClass(TestComponent);
        expect(retrievedInstance).toBe(instance);

        container.removeByClass(TestComponent);
        const removedInstance = container.getByClass(TestComponent);
        expect(removedInstance).toBeNull();
    });
});

describe('TypeEventSystem', () => {
    let eventSystem: EventSystemByClazz;

    beforeEach(() => {
        eventSystem = new EventSystemByClazz();
    });

    test('send event', () => {
        class TestEvent {
            data: string;

            constructor(data: string) {
                this.data = data;
            }
        }

        const eventHandler = jest.fn();
        const unsubscribe = eventSystem.register(TestEvent, new EventHandler(TestEvent, eventHandler, false));

        const eventData = 'Hello, Jest!';
        eventSystem.send(new TestEvent(eventData));

        expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({data: eventData}));
        unsubscribe.unregister();
    });

    test('send event with once handler', () => {
        class TestEvent {
            data: string;

            constructor(data: string) {
                this.data = data;
            }
        }

        const eventHandler = jest.fn();
        const unsubscribe = eventSystem.register(TestEvent, new EventHandler(TestEvent, eventHandler, true));

        const eventData = 'Hello, Jest!';
        eventSystem.send(new TestEvent(eventData));

        expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({data: eventData}));
        expect(eventHandler).toHaveBeenCalledTimes(1);

        // Send the event again, the once handler should not be called
        eventSystem.send(new TestEvent(eventData));
        expect(eventHandler).toHaveBeenCalledTimes(1);

        unsubscribe.unregister();
    });

    test('unregister event handler', () => {
        class TestEvent {
            data: string;

            constructor(data: string) {
                this.data = data;
            }
        }

        const eventHandler = jest.fn();
        const unsubscribe = eventSystem.register(TestEvent, new EventHandler(TestEvent, eventHandler, false));

        const eventData = 'Hello, Jest!';
        eventSystem.send(new TestEvent(eventData));

        expect(eventHandler).toHaveBeenCalledWith(expect.objectContaining({data: eventData}));

        eventHandler.mockClear();

        // Unregister the event handler
        unsubscribe.unregister();

        // Send the event again, the handler should not be called
        eventSystem.send(new TestEvent(eventData));
        expect(eventHandler).not.toHaveBeenCalled();
    });
});
