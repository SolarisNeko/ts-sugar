import {TypeMap} from "../collection/TypeMap";

export interface PlayerLike {
    // 玩家数据
    getPlayerDataMap(): TypeMap;
}

export abstract class AbstractPlayerLike implements PlayerLike {

    // 类型 Map
    protected typeMap: TypeMap = new TypeMap()

    getPlayerDataMap(): TypeMap {
        return this.typeMap;
    }

}

export class TestPlayer extends AbstractPlayerLike {

}