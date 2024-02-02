import {TypeMap} from "../collection/TypeMap";

export interface PlayerLike {
    getPlayerDataMap(): TypeMap;
}

export abstract class AbstractPlayerLike implements PlayerLike {

    protected typeMap: TypeMap = new TypeMap()

    getPlayerDataMap(): TypeMap {
        return this.typeMap;
    }

}

export class TestPlayer extends AbstractPlayerLike {

}