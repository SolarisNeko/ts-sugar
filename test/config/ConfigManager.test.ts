import {ConfigManager233} from "../../src/config/ConfigManager233";

describe('ConfigManager', () => {
    let configManager: ConfigManager233;

    beforeEach(() => {
        // Initialize a new instance of ConfigManager before each test
        configManager = ConfigManager233.instance;
    });

    it('should be a singleton', () => {
        const instance1 = ConfigManager233.instance;
        const instance2 = ConfigManager233.instance;

        expect(instance1).toBe(instance2);
    });

    it('should store and retrieve data list by type', () => {
        const jsonObjType = class SampleType {
        };
        const dataList = [{prop: 'value'}];

        configManager.setDataListByClass(jsonObjType, dataList);

        const retrievedList = configManager.getDataListByType(jsonObjType);

        expect(retrievedList).toEqual(dataList);
    });

    it('should retrieve one data by type with a default value', () => {
        const jsonObjType = class SampleType {
        };
        const dataList = [{prop: 'value'}];

        // Update the data list
        configManager.setDataListByClass(jsonObjType, dataList);

        // Try to retrieve one data, should return the first item in the list
        const retrievedData = configManager.getDataOneByType(jsonObjType);

        expect(retrievedData).toEqual(dataList[0]);
    });

    it('should retrieve null when getting one data with an empty list', () => {
        const jsonObjType = class SampleType {
        };

        // Try to retrieve one data from an empty list
        const retrievedData = configManager.getDataOneByType(jsonObjType);

        expect(retrievedData).toBeNull();
    });

    it('should delete data list by type', () => {
        const jsonObjType = class SampleType {
        };
        const dataList = [{prop: 'value'}];

        // Update the data list
        configManager.setDataListByClass(jsonObjType, dataList);

        // Delete the data list
        configManager.removeDataListByClass(jsonObjType);

        // Try to retrieve the deleted list, should be null
        const retrievedList = configManager.getDataListByType(jsonObjType);

        expect(retrievedList).toBeNull();
    });
});
