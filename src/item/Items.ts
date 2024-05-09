import {DataStream} from "../dataStream/DataStream";
import {MapUtils} from "../utils/MapUtils";
import {ObjectUtils} from "../utils/ObjectUtils";
import {FromDataGenerateField} from "../decorator/TipsDecorator";

/**
 * 道具配置
 */
export class ItemConfig {
    // 道具id
    itemId: number;
    // 道具类型
    itemType: string;
    // 道具名
    itemName: string;
    // 最大持有数量
    maxCount: number;
    // 是否是唯一物品
    uniqueFlag: boolean;
    // 多少个该物品, 占用1个背包格子
    countPerGrid: number
}

export class Item {
    // 物品 id
    itemId: number;
    // 数量 | 可以加减
    count: number;
    // 唯一id. > 0 = 是唯一物品, 此时 count 只能为 1
    uid: number
}

/**
 * 玩家持有的道具
 */
export class PlayerItem extends Item {
    // 道具id
    itemId: number;
    // 数量
    count: number;
    // 唯一id
    uid: number;
    // 道具类型
    itemType: string;
    // 过期时间. 0 = 不考虑过期
    expireTimeMs: number;
    // 附加数据, 不一定有
    data?: any;

    isUniqueItem(): boolean {
        return this.uid > 0
    }

    isSameItem(other: PlayerItem): boolean {
        if (this.isUniqueItem()) {
            return this.uid == other.uid;
        }

        return this.itemId === other.itemId;
    }
}

/**
 * 物品配置管理器
 */
export class ItemConfigManager {
    public static readonly instance = new ItemConfigManager();

    @FromDataGenerateField()
    private itemConfigs: Map<number, ItemConfig> = new Map();

    /**
     * 注册道具配置
     * @param itemConfigs 道具配置
     */
    registerItemConfig(itemConfigs: ItemConfig[]): void {
        for (let itemConfig of itemConfigs) {
            this.itemConfigs.set(itemConfig.itemId, itemConfig);

        }
    }

    /**
     * 根据道具id获取道具配置
     * @param itemId 道具id
     * @returns 道具配置，若不存在则返回null
     */
    getItemConfigById(itemId: number): ItemConfig | null {
        return this.itemConfigs.get(itemId) || null;
    }

    getItemConfigByIdNotNull(itemId: number): ItemConfig {
        let itemConfig: ItemConfig = this.itemConfigs.get(itemId);
        if (!itemConfig) {
            throw new Error(`没找到物品配置. itemId=${itemId}`)
        }
        return itemConfig;
    }
}

/**
 * 玩家背包
 */
export class PlayerBackpack {

    // <itemType, <itemId, 背包物品>>
    private itemTypeToItemIdMap = new Map<string, Map<number, PlayerItem[]>>();

    /**
     * 添加道具到背包
     * @param items 道具
     */
    addItems(items: Item[]): void {
        this.checkCanMinusAndAdd([], items)

        for (let item of items) {
            this.addItemToBackpack(item);
        }
    }

    /**
     * 从背包减少道具
     * @param items 道具数组
     */
    minusItems(items: Item[]): void {
        const newItems: Item[] = items.map(item => {
            const newItem = ObjectUtils.cloneDataObject(item);
            newItem.count = -Math.abs(newItem.count);
            return newItem;
        });

        this.checkCanMinusAndAdd(newItems, []);

        newItems.forEach(newItem => {
            this.addItemToBackpack(newItem);
        });
    }


    /**
     * 设置背包中的道具
     * @param items 道具
     */
    resetItems(items: Item[]): void {
        // 清空背包
        this.clearBackpack();

        this.addItems(items);
    }

    /**
     * 获取指定类型的所有道具
     * @param itemType 道具类型
     * @returns 道具列表
     */
    getItemsByType(itemType: string): PlayerItem[] {
        const itemIdMap = this.itemTypeToItemIdMap.get(itemType);
        if (itemIdMap) {
            return DataStream.from(Array.from(itemIdMap.values()))
                .flatMap((it) => Array.from(it))
                .toList()
        }
        return [];
    }

    /**
     * 清空背包
     */
    clearBackpack(): void {
        this.itemTypeToItemIdMap.clear();
    }

    /**
     * 将 Item 转换为 PlayerStackItem 类型
     * @param item 道具
     * @returns PlayerStackItem 实例
     */
    private convertToPlayerStackItem(item: Item): PlayerItem {
        const playerItem = new PlayerItem();
        let itemId: number = item.itemId;
        playerItem.itemId = itemId;
        playerItem.count = item.count;

        // 根据 itemId 获取道具类型
        const itemConfig = ItemConfigManager.instance.getItemConfigById(itemId);
        if (!itemConfig) {
            throw new Error(`没找到物品配置. itemId=${itemId}`);
        }
        playerItem.itemType = itemConfig.itemType;
        playerItem.uid = item.uid || 0;

        playerItem.expireTimeMs = 0;
        playerItem.data = undefined;
        return playerItem;
    }

    /**
     * 添加道具到背包
     * @param newItem 道具项
     */
    private addItemToBackpack(newItem: Item): void {
        const {itemId} = newItem;

        const itemConfig: ItemConfig = ItemConfigManager.instance.getItemConfigByIdNotNull(itemId);
        const uniqueFlag: boolean = itemConfig.uniqueFlag;
        const itemType = itemConfig.itemType


        let itemIdMap: Map<number, PlayerItem[]> = MapUtils.getOrCreate(
            this.itemTypeToItemIdMap,
            itemType,
            () => new Map<number, PlayerItem[]>(),
        );

        let items: PlayerItem[] = itemIdMap.get(itemId) || [];

        // 执行扣减逻辑
        let tempCount = newItem.count; // 记录需要扣减的数量
        if (tempCount < 0) {
            if (uniqueFlag) {
                // 对于唯一物品，从背包中移除指定物品
                const index = items.findIndex(item => {
                    if (item.uid === newItem.uid) {
                        return true
                    }
                    return item.itemId === newItem.itemId;

                });
                if (index !== -1) {
                    items.splice(index, 1);
                    tempCount++; // 扣减成功后，tempCount加1
                }
            } else {
                // 对于非唯一物品，减少相应数量
                for (let i = 0; i < items.length && tempCount < 0; i++) {
                    const currentCount = items[i].count;
                    const remainingCount = currentCount + tempCount;
                    if (remainingCount <= 0) {
                        tempCount += currentCount;
                        items.splice(i, 1);
                        i--;
                    } else {
                        items[i].count = remainingCount;
                        tempCount = 0; // 扣减完成，将tempCount置为0
                    }
                }
            }
        }

        // 执行增加逻辑
        if (tempCount > 0) {
            if (uniqueFlag) {
                let newPlayerItem: PlayerItem = this.convertToPlayerStackItem(newItem);
                // 对于唯一物品，直接添加到背包
                items.push(newPlayerItem);
            } else {
                // 对于非唯一物品，如果背包中不存在该物品，则直接添加；否则将数量叠加
                if (items.length === 0) {
                    let newPlayerItem: PlayerItem = this.convertToPlayerStackItem(newItem);
                    items.push(newPlayerItem);
                } else {
                    let existingItem: PlayerItem = items[0];
                    existingItem.count += newItem.count;
                }
            }
        }

        itemIdMap.set(itemId, items);
    }


    /**
     * 从背包移除道具
     * @param playerItem 道具项
     */
    private removeItemFromBackpack(playerItem: PlayerItem): void {
        const itemIdMap = this.itemTypeToItemIdMap.get(playerItem.itemType);
        if (itemIdMap) {
            itemIdMap.delete(playerItem.itemId);
        }
    }

    private checkCanMinusAndAdd(reduceItems: Item[], addItems: Item[]): void {
        let map: Map<number, number> = new Map<number, number>();
        for (let reduceItem of reduceItems) {
            MapUtils.merge(
                map,
                reduceItem.itemId,
                -Math.abs(reduceItem.count),
                (v1, v2) => v1 + v2,
            )
        }
        for (let addItem of addItems) {
            MapUtils.merge(
                map,
                addItem.itemId,
                addItem.count,
                (v1, v2) => v1 + v2,
            )
        }

        for (const [itemId, count] of map) {
            // 根据 itemId 获取道具配置
            const itemConfig = ItemConfigManager.instance.getItemConfigByIdNotNull(itemId);
            let itemType: string = itemConfig.itemType;

            let itemIdMap: Map<any, any> = this.itemTypeToItemIdMap.get(itemType) || new Map();
            let items: PlayerItem[] = itemIdMap.get(itemId) || [];

            const haveCount = items.map(item => item.count)
                .reduce((v1, v2) => v1 + v2, 0)

            let afterAddCount: number = haveCount + count;
            if (afterAddCount < 0) {
                throw new Error(`不足以背包扣款. itemId=${itemId}, haveCount=${haveCount}, minusCount=${count}`)
            } else {
                let maxCount: number = itemConfig.maxCount;
                if (afterAddCount > maxCount) {
                    throw new Error(`无法放入背包. itemId=${itemId}, haveCount=${haveCount}, addCount=${count}, afterAddCount=${afterAddCount}, maxCount=${maxCount}`)
                }
            }
        }


    }
}
