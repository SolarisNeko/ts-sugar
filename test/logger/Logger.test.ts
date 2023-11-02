import Logger from "../../src/logger/Logger";

describe('Logger', () => {

    it('demo', () => {

        Logger.debug('Test DEBUG');
        Logger.info('Test info');
        Logger.warn('Test warn');
        Logger.error('Test error');
    })
});