import {RedDotPath} from "./structs/RedDotPath";
import {RedDotShowType} from "./RedDotShowType";

export class RedDotKeys {

    // 无红点
    static readonly Null = RedDotPath.create("/Null");

    // ------------------------------- 抽卡 ----------------------------------

    // 抽卡
    static readonly drawCard = RedDotPath.create("/drawCard");
    // 抽卡/普通抽
    static readonly drawCard_normalHero = RedDotPath.create("/drawCard/normalHero", RedDotShowType.HIGH);
    // 抽卡/普通抽/10抽
    static readonly drawCard_normalHero_draw10 = RedDotPath.create("/drawCard/normalHero/draw10", RedDotShowType.HIGH);

    // 抽卡/自选保底
    static readonly drawCard_poolHero = RedDotPath.create("/drawCard/poolHero", RedDotShowType.HIGH);
    // 抽卡/自选保底/10抽
    static readonly drawCard_poolHero_draw10 = RedDotPath.create("/drawCard/poolHero/draw10", RedDotShowType.HIGH);

    // 抽卡/装备
    static readonly drawCard_equip = RedDotPath.create("/drawCard/equip", RedDotShowType.HIGH);
    // 抽卡/装备/免费
    static readonly drawCard_equip_free = RedDotPath.create("/drawCard/equip/free", RedDotShowType.HIGH);
    // 抽卡/装备/10抽
    static readonly drawCard_equip_draw10 = RedDotPath.create("/drawCard/equip/draw10", RedDotShowType.HIGH);
    // 抽卡/装备/奖励箱子
    static readonly drawCard_equip_reward = RedDotPath.create("/drawCard/equip/reward", RedDotShowType.HIGH);


    // ------------------------------- 每日boss ----------------------------------

    // 每日boss
    static readonly dailyBoss = RedDotPath.create("/dailyBoss");
    // 每日boss/挑战
    static readonly dailyBoss_challenge = RedDotPath.create("/dailyBoss/challenge", RedDotShowType.HIGH);

    // ------------------------------- 挂机 ----------------------------------

    // 挂机
    static readonly hangUp = RedDotPath.create("/hangUp");
    // 挂机 路径奖励
    static readonly hangUp_roadReward = RedDotPath.create("/hangUp/roadReward", RedDotShowType.REWARD);

    // ------------------------------- 竞技场 ----------------------------------

    // 竞技场
    static readonly jjc = RedDotPath.create("/jjc");
    // 竞技场 每日挑战
    static readonly jjcChallenge = RedDotPath.create(`/jjc/challenge`, RedDotShowType.HIGH);
    // 竞技场 每周进度奖励
    static readonly jjcRewardWeekly = RedDotPath.create(`/jjc/rewardWeekly`, RedDotShowType.REWARD);

    // ------------------------------- 背包 ----------------------------------

    // 背包入口
    static readonly backpack = RedDotPath.create("/backpack");
    // 背包道具
    static readonly backpackItem = RedDotPath.create(`/backpack/item/\${key0}`);

    // ------------------------------- 英雄 ----------------------------------
    /**英雄入口 */
    static readonly Hero_enter = RedDotPath.create("/Hero_enter");
    /**英雄列表 */
    static readonly Hero_list = RedDotPath.create("/Hero_enter/list");
    /**英雄详情 */
    static readonly Hero_detail = RedDotPath.create("/Hero_enter/list/Hero_detail");
    /**英雄培养 */
    static readonly Hero_train = RedDotPath.create("/Hero_enter/list/Hero_train");
    /**英雄升星 */
    static readonly Hero_star = RedDotPath.create("/Hero_enter/list/Hero_star");
    /**英雄强化 */
    static readonly Hero_strengthen = RedDotPath.create("/Hero_enter/list/Hero_strengthen");
    /**英雄强化 */
    static readonly Hero_skill = RedDotPath.create("/Hero_enter/list/Hero_skill");
    /**英雄升阶 */
    static readonly Hero_upgrade = RedDotPath.create("/Hero_enter/list/Hero_upgrade");


    /**联盟系统入口 */
    static readonly League_enter = RedDotPath.create("/League");


    /**联盟中心入口1 */
    static readonly League_center1 = RedDotPath.create("/League/center1", RedDotShowType.NULL);
    /**联盟中心入口2 */
    static readonly League_center2 = RedDotPath.create("/League/center2", RedDotShowType.NULL);
    /**申请列表 */
    static readonly League_apply = RedDotPath.create("/League_apply", RedDotShowType.HIGH);

    /**联盟挑战 */
    static readonly League_challenge = RedDotPath.create("/League/challenge", RedDotShowType.REWARD);


    /**联盟商店 */
    static readonly League_shop = RedDotPath.create("/League/shop");

    /**联盟科技入口 */
    static readonly League_tech = RedDotPath.create("/League/tech");

    /**联盟宝箱入口 */
    static readonly League_box = RedDotPath.create("/League_box");
    /**联盟宝箱任务完成提示*/
    static readonly League_box_TaskTab = RedDotPath.create("/League_box_TaskTab");
    //盟友赠礼领取提示
    static readonly League_Box_giftTab = RedDotPath.create("/League_Box_giftTab");
    /**联盟赠礼领取列表 */
    static readonly League_Box_giftList = RedDotPath.create("/League_Box_giftList");

    /**赠礼发放提示 */
    static readonly League_Box_sendGiftBtn = RedDotPath.create("/League_Box_sendGiftBtn");

    /**联盟boss入口 */
    static readonly League_boss = RedDotPath.create("/League_boss");
    /**挑战按键红点 */
    static readonly League_boss_challenge = RedDotPath.create("/League_boss_challenge");


    /**商店 */
    static readonly Shop_enter = RedDotPath.create("/more/Shop", RedDotShowType.REWARD);


    /**主界面按钮 */
    static readonly moreBtn = RedDotPath.create("/more");


    // 图鉴总红点 | 在英雄入口里面
    static readonly Illustrations_Main = RedDotPath.create('/Hero_enter/Illustrations_Main', RedDotShowType.HIGH);
    /**图鉴全部英雄页签*/
    static readonly Illustrations_Hero_All = RedDotPath.create('/Hero_enter/Illustrations_Main/All', RedDotShowType.HIGH);
    /**图鉴英雄阵营页签1*/
    static readonly Illustrations_Hero_Camp1 = RedDotPath.create('/Hero_enter/Illustrations_Main/All', RedDotShowType.HIGH);
    /**图鉴英雄阵营页签2*/
    static readonly Illustrations_Hero_Camp2 = RedDotPath.create('/Hero_enter/Illustrations_Main/All/Camp2', RedDotShowType.HIGH);
    /**图鉴英雄阵营页签3*/
    static readonly Illustrations_Hero_Camp3 = RedDotPath.create('/Hero_enter/Illustrations_Main/All/Camp3', RedDotShowType.HIGH);
    /**图鉴英雄阵营页签4*/
    static readonly Illustrations_Hero_Camp4 = RedDotPath.create('/Hero_enter/Illustrations_Main/All/Camp4', RedDotShowType.HIGH);
    /**图鉴全部武器页签*/
    static readonly Illustrations_Weapon_All = RedDotPath.create('/Hero_enter/Illustrations_Main/All/Weapon_All', RedDotShowType.HIGH);
    /**图鉴奖励*/
    static readonly Illustrations_Reward = RedDotPath.create('/Hero_enter/Illustrations_Main/All/Reward', RedDotShowType.REWARD);

    /**充值入口*/
    static readonly Charge_enter = RedDotPath.create('/Charge', RedDotShowType.REWARD);
    /**充值(限购商城)*/
    static readonly Charge_limit = RedDotPath.create('/Charge/limit', RedDotShowType.REWARD);
    /**充值(每日特惠)*/
    static readonly Charge_dailySale = RedDotPath.create('/Charge/dailySale', RedDotShowType.REWARD);
    /**充值(每日特惠 免费礼包)*/
    static readonly Charge_dailySale_free = RedDotPath.create('/Charge/dailySale/dailySale_free', RedDotShowType.REWARD);
    /**充值(每日特惠 一键领取)*/
    static readonly Charge_dailySale_drawAll = RedDotPath.create('/Charge/dailySale/dailySale_drawAll', RedDotShowType.REWARD);
    /**充值(vip)*/
    static readonly Charge_vip = RedDotPath.create('/Charge/vip', RedDotShowType.REWARD);

    /**活动-开服活动总key*/
    static readonly Activity_openCharge = RedDotPath.create('/openCharge', RedDotShowType.REWARD);
    /**活动-开服累充*/
    static readonly Activity_totalCharge = RedDotPath.create('/openCharge/totalCharge', RedDotShowType.REWARD);
    /**活动-新手特惠*/
    static readonly Activity_rookieSale = RedDotPath.create('/openCharge/rookieSale', RedDotShowType.REWARD);
    /**活动-累天充值*/
    static readonly Activity_totalChargeDay = RedDotPath.create('/openCharge/totalChargeDay', RedDotShowType.REWARD);

    /**好友入口*/
    static readonly Friend_enter = RedDotPath.create('/Friend');
    /**好友申请*/
    static readonly Friend_apply = RedDotPath.create('/Friend/apply', RedDotShowType.HIGH);
    /**好友列表*/
    static readonly Friend_list = RedDotPath.create('/Friend/list', RedDotShowType.HIGH);
    /**好友领取赠送礼物*/
    static readonly Friend_giveAndDrawGift = RedDotPath.create('/Friend/list/giveAndDrawGift', RedDotShowType.REWARD);
}