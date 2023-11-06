import DateTimeUtils from "../../src/time/DateTimeUtils";

describe('DateTimeUtils', () => {
    let dateTimeUtils: DateTimeUtils;

    beforeEach(() => {
        dateTimeUtils = new DateTimeUtils();
    });

    test('getDateTimeText should format date correctly', () => {
        const date = new Date('2023-10-25T13:30:00Z');
        const expectedFormattedDate = '2023-10-25 13:30:00';
        const formattedDate = dateTimeUtils.getDateTimeText(date.getTime());
        expect(formattedDate).toBe(expectedFormattedDate);
    });

    test('getTomorrowStartTime should calculate the correct time', () => {
        const mockDate = new Date('2023-10-25T13:30:00Z').getTime();
        const offsetHour = 8; // 8 AM
        const tomorrowStartTime = dateTimeUtils.getTomorrowStartTime(mockDate, offsetHour);
        const expectedTime = new Date('2023-10-26T08:00:00Z').getTime();
        expect(tomorrowStartTime).toBe(expectedTime);
    });

    test('getYesterdayStartTime should calculate the correct time', () => {
        const mockDate = new Date('2023-10-25T13:30:00Z').getTime();
        const offsetHour = 8; // 8 AM
        const yesterdayStartTime = dateTimeUtils.getYesterdayStartTime(mockDate, offsetHour);
        const expectedTime = new Date('2023-10-24T08:00:00Z').getTime();
        expect(yesterdayStartTime).toBe(expectedTime);
    });

    test('getRefreshDataTime should return correct time based on offsetHour', () => {
        const mockDate = new Date('2023-10-25T13:30:00Z').getTime();
        const offsetHour = 10; // 10 AM
        const refreshTime = dateTimeUtils.getRefreshDataTime(mockDate, offsetHour);
        const expectedTime = new Date('2023-10-26T10:00:00Z').getTime();
        expect(refreshTime).toBe(expectedTime);
    });

    test('getLastRefreshDateTime should return correct time based on offsetHour', () => {
        const mockDate = new Date('2023-10-25T13:30:00Z').getTime();
        const offsetHour = 10; // 10 AM
        const lastRefreshTime = dateTimeUtils.getLastRefreshDateTime(mockDate, offsetHour);
        const expectedTime = new Date('2023-10-25T10:00:00Z').getTime();
        expect(lastRefreshTime).toBe(expectedTime);
    });

    test('getMonthBySecond should return correct month', () => {
        const mockDate = new Date('2023-10-25T13:30:00Z').getTime();
        const month = dateTimeUtils.getMonthBySecond(mockDate);
        expect(month).toBe(10);
    });

    // Add more test cases to cover other methods and edge cases...
});
