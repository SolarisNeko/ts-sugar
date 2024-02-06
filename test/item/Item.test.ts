import {Item, ItemConfig, ItemConfigManager, PlayerBackpack, PlayerItem} from "../../src/item/Items";
import ObjectUtils from "../../src/utils/ObjectUtils";

ItemConfigManager.instance.registerItemConfig([
    ObjectUtils.initObjByClass(ItemConfig, (self) => {
        self.itemId = 1
        self.itemType = 'weapon'
        self.maxCount = 999
        self.countPerGrid = 1
        self.itemName = 'demo武器1'
        self.uniqueFlag = true
    }),
    ObjectUtils.initObjByClass(ItemConfig, (self) => {
        self.itemId = 2
        self.itemType = 'armor'
        self.maxCount = 999
        self.countPerGrid = 1
        self.itemName = 'demo武器2'
        self.uniqueFlag = true
    }),
]);

describe('PlayerBackpack', () => {
    let backpack: PlayerBackpack;

    beforeEach(() => {
        backpack = new PlayerBackpack();


    });

    it('should add item to backpack', () => {
        const item: PlayerItem = new PlayerItem();
        item.itemId = 1;
        item.itemType = 'weapon';
        item.count = 1;

        backpack.addItems([item]);

        const items = backpack.getItemsByType('weapon');
        expect(items.length).toBe(1);
        expect(items[0].itemId).toBe(item.itemId);
        expect(items[0].count).toBe(item.count);
    });

    it('should remove item from backpack', () => {
        const item: PlayerItem = new PlayerItem();
        item.itemId = 1;
        item.itemType = 'weapon';
        item.count = 1;

        backpack.addItems([item]);
        backpack.minusItems([item]);

        const items = backpack.getItemsByType('weapon');
        expect(items.length).toBe(0);
    });

    it('should set item in backpack', () => {
        const item1 = new Item();
        item1.itemId = 1;
        item1.count = 1;

        const item2 = new Item();
        item2.itemId = 2;
        item2.count = 1;

        backpack.addItems([item1]);
        backpack.resetItems([item2]);

        const items1 = backpack.getItemsByType('weapon');
        expect(items1.length).toBe(0);

        const items2 = backpack.getItemsByType('armor');
        expect(items2.length).toBe(1);
        expect(items2[0].itemId).toBe(item2.itemId);
        expect(items2[0].count).toBe(item2.count);
    });

    it('should throw error when trying to add more than maxCount', () => {
        const itemConfig: ItemConfig = new ItemConfig();
        itemConfig.itemId = 1;
        itemConfig.itemType = 'weapon';
        itemConfig.maxCount = 5;

        ItemConfigManager.instance.registerItemConfig([itemConfig]);

        const item1: PlayerItem = new PlayerItem();
        item1.itemId = 1;
        item1.itemType = 'weapon';
        item1.count = 4;

        const item2: PlayerItem = new PlayerItem();
        item2.itemId = 1;
        item2.itemType = 'weapon';
        item2.count = 2;

        backpack.addItems([item1]);
        expect(() => backpack.addItems([item2])).toThrowError();
    });

    it('should throw error when trying to remove more than haveCount', () => {
        const itemConfig: ItemConfig = new ItemConfig();
        itemConfig.itemId = 1;
        itemConfig.itemType = 'weapon';
        itemConfig.maxCount = 5;

        ItemConfigManager.instance.registerItemConfig([itemConfig]);

        const item: PlayerItem = new PlayerItem();
        item.itemId = 1;
        item.itemType = 'weapon';
        item.count = 3;

        backpack.addItems([item]);

        item.count = item.count + 1
        expect(() => backpack.minusItems([item])).toThrowError();
    });
});
