// 示例用法
import Coordinate3D from "../../src/coordinate/Coordinate3D";
import {Direction} from "../../src/coordinate/Direction";
import Coordinate3DMap from "../../src/coordinate/Coordinate3DMap";

const xyzMap = new Coordinate3DMap<number>();

const center = new Coordinate3D(0, 0, 0);
xyzMap.setValueAt(center, 10);

// 获取相邻坐标值
const front = center.move(Direction.Front);
const back = center.move(Direction.Back);
const left = center.move(Direction.Left);
const right = center.move(Direction.Right);

const frontValue = xyzMap.getValueAt(front); // 获取 (0,0,1) 坐标的值

console.log(`Center Value: ${xyzMap.getValueAt(center)}`); // 输出: Center Value: 10
console.log(`Front Value: ${frontValue}`); // 输出: Front Value: undefined
