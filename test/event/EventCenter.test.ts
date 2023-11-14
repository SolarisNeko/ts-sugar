import { EventCenter } from "../../src/event/EventCenter";

describe('EventCenter', () => {
  let eventCenter: EventCenter;

  beforeEach(() => {
    eventCenter = new EventCenter();
  });

  it('should add and trigger event callbacks', () => {
    const eventName = 'testEvent';
    const callback = jest.fn();
    const self = {};

    eventCenter.on(eventName, callback, self);

    const eventData = 'testData';
    eventCenter.trigger(eventName, eventData);

    expect(callback).toHaveBeenCalledWith(eventData);
  });

  it('should remove event callbacks', () => {
    const eventName = 'testEvent';
    const callback = jest.fn();
    const self = {};

    eventCenter.on(eventName, callback, self);
    eventCenter.off(eventName, callback, self);

    const eventData = 'testData';
    eventCenter.trigger(eventName, eventData);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should cancel events for a target', () => {
    const eventName = 'testEvent';
    const callback = jest.fn();
    const self = {};

    eventCenter.on(eventName, callback, self);

    const anotherCallback = jest.fn();
    const anotherSelf = {};
    eventCenter.on(eventName, anotherCallback, anotherSelf);

    eventCenter.cancelEventsForTarget(self);

    const eventData = 'testData';
    eventCenter.trigger(eventName, eventData);

    expect(callback).not.toHaveBeenCalled();
    expect(anotherCallback).toHaveBeenCalled();
  });
});
