import Actor from "../../src/actor/actor";


class ActorImpl extends Actor {

}

describe('Actor Class', () => {
    let actor: Actor;

    beforeEach(() => {
        actor = new ActorImpl();
    });

    it('should register and execute exclusive callback', () => {
        let result = 0;
        const callback = (data: number) => {
            result = data;
        };

        actor.registerExclusiveCallback('testKey', callback);
        actor.executeCallbacks('testKey', 42);

        expect(result).toBe(42);
    });

    it('should register and execute multiple callbacks', () => {
        let result = 0;
        const callback1 = (data: number) => {
            result += data;
        };
        const callback2 = (data: number) => {
            result *= data;
        };
        const callback3 = (data: number) => {
            result -= data;
        };

        actor.registerMultipleCallbacks('testKey', [callback1, callback2, callback3]);
        actor.executeCallbacks('testKey', 5);

        expect(result).toBe(((0 + 5) * 5) - 5);
    });

    it('should add and execute a callback', () => {
        let result = 1;
        const callback = (data: number) => {
            result *= data;
        };

        actor.addCallback('testKey', callback);
        actor.executeCallbacks('testKey', 5);

        expect(result).toBe(5);
    });

    it('should remove a single callback', () => {
        let result = 2;
        const callback1 = (data: number) => {
            result += data;
        };
        const callback2 = (data: number) => {
            result -= data;
        };

        actor.addCallback('testKey', callback1);
        actor.addCallback('testKey', callback2);
        actor.removeCallbackSingle('testKey', callback1);
        actor.executeCallbacks('testKey', 4);

        expect(result).toBe(2 - 4);
    });

    it('should remove all callbacks for a key', () => {
        let result = 2;
        const callback1 = (data: number) => {
            result += data;
        };
        const callback2 = (data: number) => {
            result -= data;
        };

        actor.addCallback('testKey', callback1);
        actor.addCallback('testKey', callback2);
        actor.removeCallback('testKey');
        actor.executeCallbacks('testKey', 4);

        expect(result).toBe(2);
    });

    it('should schedule a one-time callback', (done) => {
        let result = false;
        const callback = () => {
            result = true;
        };

        actor.scheduleOnce(callback, 10);

        setTimeout(() => {
            expect(result).toBe(true);
            done();
        }, 15);
    });

    it('should schedule an interval callback', (done) => {
        let result = 0;
        const callback = () => {
            result++;
        };

        actor.scheduleInterval(callback, 10);

        setTimeout(() => {
            expect(result).toBeGreaterThan(1);
            done();
        }, 25);
    });

    it('should schedule a repeated callback', (done) => {
        let result = 0;
        const callback = () => {
            result++;
        };

        actor.scheduleRepeated(callback, 10, 10);

        setTimeout(() => {
            expect(result).toBeGreaterThan(1);
            done();
        }, 35);
    });
});
