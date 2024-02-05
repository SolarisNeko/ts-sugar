// /**
//  * 活动阶段 enum
//  */
// export enum ActivityPhaseEnum {
//     // 未开启，displayFlag = false, 但是 joinFlag = false
//     NotOpen,
//     // displayFlag = true, 但是 joinFlag = false
//     Open,
//     // displayFlag = true, 但是 joinFlag = true
//     Join,
//     // displayFlag = true, 但是 joinFlag = true , 超出 endTimeMs
//     Balance,
//     // 活动已关闭
//     Close,
// }
//
// /**
//  * 活动状态数据
//  */
// export interface ActivityStateData {
//     // 活动ID
//     activityId: number;
//     // 活动阶段
//     phase: ActivityPhaseEnum;
//     // 活动开始时间戳
//     startTimeMs: number;
//     // 活动结束时间戳
//     endTimeMs: number;
//     // 开启轮次
//     turnCount: number;
//     // 玩家是否能看到
//     displayFlag: boolean;
//     // 是否参与
//     joinFlag: boolean;
//     // 每个活动定制的数据
//     data: any;
// }
//
// /**
//  * 活动信息
//  */
// class ActivityInfo {
//     // 活动ID
//     activityId: number;
//     // 活动开始时间戳
//     startTimeMs: number;
//     // 活动结束时间戳
//     endTimeMs: number;
//     // 开启轮次
//     turnCount: number;
//     // 玩家是否能看到
//     displayFlag: boolean;
//     // 是否参与
//     joinFlag: boolean;
//     // 每个活动定制的数据
//     data: any;
// }
//
// /**
//  * 活动管理器
//  */
// class ActivityManager {
//     // 活动集合
//     private activities: Map<number, ActivityInfo>;
//
//
//     /**
//      * 添加活动
//      * @param activityId 活动ID
//      * @param startTimeMs 活动开始时间戳
//      * @param endTimeMs 活动结束时间戳
//      * @param turnCount 开启轮次
//      * @param displayFlag 玩家是否能看到
//      * @param joinFlag 是否参与
//      * @param data 每个活动定制的数据
//      */
//     addActivity(activityId: number,
//                 startTimeMs: number,
//                 endTimeMs: number,
//                 turnCount: number,
//                 displayFlag: boolean,
//                 joinFlag: boolean,
//                 data: any,
//     ): void {
//         const activity = new ActivityInfo(activityId, startTimeMs, endTimeMs, turnCount, displayFlag, joinFlag, data);
//         this.activities.set(activityId, activity);
//     }
//
//     /**
//      * 移除活动
//      * @param activityId 活动ID
//      */
//     removeActivity(activityId: number): void {
//         this.activities.delete(activityId);
//     }
//
//     /**
//      * 获取活动状态数据
//      * @param activityId 活动ID
//      * @returns 活动状态数据，若活动不存在则返回null
//      */
//     getActivityStateData(activityId: number): ActivityStateData | null {
//         const activity = this.activities.get(activityId);
//
//         if (activity) {
//             const currentTime = Date.now();
//
//             if (!activity.displayFlag) {
//                 return {activityId, phase: ActivityPhaseEnum.NotOpen, ...activity};
//             } else if (!activity.joinFlag) {
//                 return {activityId, phase: ActivityPhaseEnum.Open, ...activity};
//             } else if (currentTime < activity.endTimeMs) {
//                 return {activityId, phase: ActivityPhaseEnum.Join, ...activity};
//             } else if (currentTime <= activity.endTimeMs) {
//                 return {activityId, phase: ActivityPhaseEnum.Balance, ...activity};
//             } else {
//                 return {activityId, phase: ActivityPhaseEnum.Close, ...activity};
//             }
//         }
//
//         return null;
//     }
//
//     /**
//      * 获取所有活动状态数据
//      * @returns 所有活动状态数据的数组
//      */
//     getAllActivityStateData(): ActivityStateData[] {
//         const result: ActivityStateData[] = [];
//
//         for (const activity of this.activities.values()) {
//             const stateData = this.getActivityStateData(activity.activityId);
//
//             if (stateData) {
//                 result.push(stateData);
//             }
//         }
//
//         return result;
//     }
// }
//
// // 示例用法
// const activityManager = new ActivityManager();
//
// activityManager.addActivity(1, Date.now(), Date.now() + 10000, 3, true, false, {customData: 'example'});
// activityManager.addActivity(2, Date.now() - 10000, Date.now() - 5000, 2, true, true, {customData: 'example'});
//
// const activityStateData = activityManager.getActivityStateData(1);
// console.log(activityStateData);
//
// const allActivityStateData = activityManager.getAllActivityStateData();
// console.log(allActivityStateData);
