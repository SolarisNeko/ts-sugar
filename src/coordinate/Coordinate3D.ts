import {
    Direction,
    DirectionEnumArray
} from "./Direction";

export interface IMapData<T> {
    type: string;
    data: T;
}


export class Coordinate3D {
    constructor(public x: number,
                public y: number,
                public z: number
    ) {
    }

    move(side: Direction): Coordinate3D {
        switch (side) {
            case Direction.Up:
                return new Coordinate3D(this.x, this.y + 1, this.z);
            case Direction.Down:
                return new Coordinate3D(this.x, this.y - 1, this.z);
            case Direction.Left:
                return new Coordinate3D(this.x - 1, this.y, this.z);
            case Direction.Right:
                return new Coordinate3D(this.x + 1, this.y, this.z);
            case Direction.Front:
                return new Coordinate3D(this.x, this.y, this.z + 1);
            case Direction.Back:
                return new Coordinate3D(this.x, this.y, this.z - 1);
            default:
                return new Coordinate3D(this.x, this.y, this.z);
        }
    }

    toString(): string {
        return `(${this.x},${this.y},${this.z})`;
    }
}


export class Coordinate3DMap<T extends IMapData<any>> {
    private map: Map<Coordinate3D, T>;

    constructor() {
        this.map = new Map<Coordinate3D, T>();
    }

    setValueAt(coordinate: Coordinate3D,
               value: T
    ): void {
        this.map.set(coordinate, value);
    }

    getValueAt(coordinate: Coordinate3D): T | undefined {
        return this.map.get(coordinate);
    }

    bfsRangeScan(origin: Coordinate3D,
                 maxDistance: number = 999
    ): Coordinate3D[] {
        const visited = new Set<string>();
        const queue: { coordinate: Coordinate3D; distance: number }[] = [];
        const similarType = this.getValueAt(origin);
        const result: Coordinate3D[] = [];

        if (!similarType) {
            return result;
        }

        queue.push({coordinate: origin, distance: 0});
        visited.add(origin.toString());

        while (queue.length > 0) {
            const current = queue.shift()!;
            const {coordinate, distance} = current;

            if (distance > 0) {
                result.push(coordinate);
            }

            if (distance >= maxDistance) {
                break;
            }

            for (const direction of DirectionEnumArray) {
                const newCoordinate = coordinate.move(direction);

                if (newCoordinate && !visited.has(newCoordinate.toString())) {
                    const newType = this.getValueAt(newCoordinate);
                    if (newType && newType.type === similarType.type) {
                        visited.add(newCoordinate.toString());
                        queue.push({coordinate: newCoordinate, distance: distance + 1});
                    }
                }
            }
        }

        return result;
    }

}
