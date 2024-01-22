import {Loggers} from "../../src/logger/Logger";

describe('Loggers.base', () => {

    it('demo', () => {

        Loggers.baseLogger.debug('Test DEBUG');
        Loggers.baseLogger.info('Test info');
        Loggers.baseLogger.warn('Test warn');
        Loggers.baseLogger.error('Test error');
    })
});