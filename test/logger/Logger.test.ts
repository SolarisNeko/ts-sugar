import {Logger, LoggerFactory} from "../../src/logger/Logger";


class LoggerForTest {

    /**
     * 基本日志器
     */
    public static baseLogger: Logger = LoggerFactory.getLogger("base")

}

describe('Loggers.base', () => {

    it('demo', () => {


        LoggerForTest.baseLogger.debug('Test DEBUG');
        LoggerForTest.baseLogger.info('Test info');
        LoggerForTest.baseLogger.warn('Test warn');
        LoggerForTest.baseLogger.error('Test error');
    })
});