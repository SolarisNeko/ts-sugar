// Mock implementation of IMapData

import {
    Coordinate3D,
    Coordinate3DMap,
    IMapData
} from "../../src/coordinate/Coordinate3D";

class MockMapData implements IMapData<any> {
    type: string;
    data: any;

    constructor(type: string) {
        this.type = type;
    }

}

describe('Coordinate3DMap', () => {
    let coordinate3DMap: Coordinate3DMap<MockMapData>;

    beforeEach(() => {
        coordinate3DMap = new Coordinate3DMap<MockMapData>();
    });

    it('should set and get value at a coordinate', () => {
        const coordinate = new Coordinate3D(1, 2, 3);
        const mockMapData = new MockMapData('mockType');

        coordinate3DMap.setValueAt(coordinate, mockMapData);

        const retrievedValue = coordinate3DMap.getValueAt(coordinate);

        expect(retrievedValue).toBe(mockMapData);
    });

    it('should return undefined for non-existing coordinates', () => {
        const nonExistingCoordinate = new Coordinate3D(4, 5, 6);

        const retrievedValue = coordinate3DMap.getValueAt(nonExistingCoordinate);

        expect(retrievedValue).toBeUndefined();
    });

    // it('should perform BFS range scan', () => {
    //     // Set up a simple map
    //     const centerCoordinate = new Coordinate3D(0, 0, 0);
    //     const centerType = new MockMapData('centerType');
    //     coordinate3DMap.setValueAt(centerCoordinate, centerType);
    //
    //     const adjacentCoordinates = [
    //         new Coordinate3D(1, 0, 0),
    //         new Coordinate3D(0, 1, 0),
    //         new Coordinate3D(0, 0, 1),
    //         new Coordinate3D(-1, 0, 0),
    //         new Coordinate3D(0, -1, 0),
    //         new Coordinate3D(0, 0, -1),
    //     ];
    //
    //     const adjacentType = new MockMapData('adjacentType');
    //
    //     adjacentCoordinates.forEach((coord) => {
    //         coordinate3DMap.setValueAt(coord, adjacentType);
    //     });
    //
    //     // Perform BFS range scan from the center
    //     const result = coordinate3DMap.bfsRangeScan(centerCoordinate, 1);
    //
    //     // Expect the result to include center and adjacent coordinates
    //     expect(result).toContainEqual(centerCoordinate);
    //     adjacentCoordinates.forEach((coord) => {
    //         expect(result).toContainEqual(coord);
    //     });
    // });
});
