import {LoggerForTest} from "../../src/logger/Logger";

describe('Loggers.base', () => {

    it('demo', () => {

        LoggerForTest.baseLogger.debug('Test DEBUG');
        LoggerForTest.baseLogger.info('Test info');
        LoggerForTest.baseLogger.warn('Test warn');
        LoggerForTest.baseLogger.error('Test error');
    })
});