/**
 * 星期几
 */
export class WeekDay {

    private constructor(public readonly weekDay: number,
                        public readonly englishName: string,
                        public readonly chineseName: string,
    ) {
    }

    static readonly MONDAY = new WeekDay(1, "Monday", "周一")
    static readonly TUESDAY = new WeekDay(2, "Tuesday", "周二")
    static readonly WEDNESDAY = new WeekDay(3, "Wednesday", "周三")
    static readonly THURSDAY = new WeekDay(4, "Thursday", "周四")
    static readonly FRIDAY = new WeekDay(5, "Friday", "周五")
    static readonly SATURDAY = new WeekDay(6, "Saturday", "周六")
    static readonly SUNDAY = new WeekDay(7, "Sunday", "周日")


    public toString(): string {
        return this.englishName;
    }


    /**
     * 根据时间戳获取星期几
     * @param timeMs 时间戳
     */
    static getWeekDayByTimeMs(timeMs: number): WeekDay {
        const date = new Date(timeMs);
        const weekDayOld = date.getDay();
        switch (weekDayOld) {
            case 0:
                return WeekDay.SUNDAY;
            case 1:
                return WeekDay.MONDAY;
            case 2:
                return WeekDay.TUESDAY;
            case 3:
                return WeekDay.WEDNESDAY;
            case 4:
                return WeekDay.THURSDAY;
            case 5:
                return WeekDay.FRIDAY;
            case 6:
                return WeekDay.SATURDAY;
            default:
                console.error(`Invalid week day | timeMs = ${timeMs}, weekDayOld = ${weekDayOld}`);
                return WeekDay.SUNDAY;
        }
    }
}
