// import { FSM, FSMState, FSMTranslation } from "../Core/FSM";
//
// const { ccclass, property } = cc._decorator;
//
// enum FSMStateType {
//     Idle = "Idle",
//     Jump = "Jump",
//     Die = "Die",
// }
//
// enum FSMTranslationType {
//     Touch_Jump = "Touch_Jump",
//     On_Idle = "On_Idle",
//     On_Idle_Die = "On_Idle_Die",
//     On_Jump_Die = "On_Jump_Die",
// }
//
// @ccclass
// export default class Test extends cc.Component {
//
//     private _fsm: FSM = new FSM();
//
//     start() {
//         // 创建状态
//         let idleState: FSMState = new FSMState(FSMStateType.Idle);
//         let jumpState: FSMState = new FSMState(FSMStateType.Jump);
//         let dieState: FSMState = new FSMState(FSMStateType.Die);
//
//         // 创建跳转
//         let idleToJumpTranslation: FSMTranslation = new FSMTranslation(FSMTranslationType.Touch_Jump, idleState, jumpState, this.jump.bind(this));
//         let jumpToIdleTranslation: FSMTranslation = new FSMTranslation(FSMTranslationType.On_Idle, jumpState, idleState, this.idle.bind(this));
//         let idleToDieTranslation: FSMTranslation = new FSMTranslation(FSMTranslationType.On_Idle_Die, idleState, dieState, this.idleDie.bind(this));
//         let jumpToDieTranslation: FSMTranslation = new FSMTranslation(FSMTranslationType.On_Jump_Die, jumpState, dieState, this.jumpDie.bind(this));
//
//         // 添加状态
//         this._fsm.addState(idleState);
//         this._fsm.addState(jumpState);
//         this._fsm.addState(dieState);
//
//         // 添加跳转
//         this._fsm.addTranslation(idleToJumpTranslation);
//         this._fsm.addTranslation(jumpToIdleTranslation);
//         this._fsm.addTranslation(idleToDieTranslation);
//         this._fsm.addTranslation(jumpToDieTranslation);
//
//         this._fsm.start(idleState);
//
//     }
//
//
//     // ---------触发事件切换状态------------------------------------------------
//
//     /** 起跳 */
//     private onJumpBtn(): void {
//         if (this._fsm.currState.name != FSMStateType.Idle) return;
//
//         this._fsm.handleEvent(FSMTranslationType.Touch_Jump);
//         this.unscheduleAllCallbacks();
//         this.scheduleOnce(() => { this._fsm.handleEvent(FSMTranslationType.On_Idle); }, 0.5);
//     }
//
//     /** 嗝儿屁 */
//     private onDieBtn(): void {
//         if (this._fsm.currState.name == FSMStateType.Jump) {
//             this._fsm.handleEvent(FSMTranslationType.On_Jump_Die);
//         } else if (this._fsm.currState.name == FSMStateType.Idle) {
//             this._fsm.handleEvent(FSMTranslationType.On_Idle_Die);
//         }
//     }
//
//     // ---------------回调---------------------------------------------
//
//     private jump(): void { console.log("jumping"); }
//
//     private idle(): void { console.log("idle"); }
//
//     private jumpDie(): void { console.log("jumpDie"); }
//
//     private idleDie(): void { console.log("idleDie"); }
// }