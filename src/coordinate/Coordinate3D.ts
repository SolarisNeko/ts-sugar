import {Direction} from "./Direction";

export default class Coordinate3D {
    constructor(public x: number,
                public y: number,
                public z: number
    ) {
    }

    move(side: Direction ): Coordinate3D {
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
