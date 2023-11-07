import DateTimeUtils from "../../src/time/DateTimeUtils";

describe('DateTimeUtils', () => {
    test('getDateTimeText should format date correctly', () => {
        const date = new Date('2023-10-25T13:30:00');
        const expectedFormattedDate = '2023-10-25 13:30:00';
        const formattedDate = DateTimeUtils.getDateTimeText(date.getTime());
        expect(formattedDate).toBe(expectedFormattedDate);
    });

    test('getTomorrowStartTime should calculate the correct time in timezone', () => {
        const mockDate = new Date('2023-10-25T13:30:00').getTime();
        const offsetHour = 8; // 8 AM
        const tomorrowStartTime = DateTimeUtils.getTomorrowStartTime(mockDate, offsetHour);
        const expectedTime = new Date('2023-10-26T08:00:00').getTime();
        expect(tomorrowStartTime).toBe(expectedTime);
    });

    test('getYesterdayStartTime should calculate the correct time in timezone', () => {
        const mockDate = new Date('2023-10-25T13:30:00').getTime();
        const offsetHour = 8; // 8 AM
        const yesterdayStartTime = DateTimeUtils.getYesterdayStartTime(mockDate, offsetHour);
        const expectedTime = new Date('2023-10-24T08:00:00').getTime();
        expect(yesterdayStartTime).toBe(expectedTime);
    });

    test('getRefreshDataTime should return correct time based on offsetHour and timezone', () => {
        const mockDate = new Date('2023-10-25T13:30:00').getTime();
        const offsetHour = 10; // 10 AM
        const refreshTime = DateTimeUtils.getRefreshDataTime(mockDate, offsetHour);
        const expectedTime = new Date('2023-10-26T10:00:00').getTime();
        expect(refreshTime).toBe(expectedTime);
    });

    test('getLastRefreshDateTime should return correct time based on offsetHour and timezone', () => {
        const mockDate = new Date('2023-10-25T13:30:00').getTime();
        const offsetHour = 10; // 10 AM
        const lastRefreshTime = DateTimeUtils.getLastRefreshDateTime(mockDate, offsetHour);
        const expectedTime = new Date('2023-10-25T10:00:00').getTime();
        expect(lastRefreshTime).toBe(expectedTime);
    });

    test('getMonthBySecond should return correct month in timezone', () => {
        const mockDate = new Date('2023-10-25T13:30:00').getTime();
        const month = DateTimeUtils.getMonthBySecond(mockDate);
        expect(month).toBe(10);
    });

    // 以及其他方法的边界情况和时区问题的测试...
});
