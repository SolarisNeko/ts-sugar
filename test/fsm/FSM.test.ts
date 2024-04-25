import {FSM, FSMState, FSMTranslation} from "../../src/fsm/FSM";


enum FSMStateType {
    Idle = "Idle",
    Jump = "Jump",
    Die = "Die",
}

enum FSMTranslationTypeEnum {
    IDLE_TO_JUMP = "IDLE_TO_JUMP",
    JUMP_TO_IDLE = "JUMP_TO_IDLE",
    IDLE_TO_DIE = "IDLE_TO_DIE",
    JUMP_TO_DIE = "JUMP_TO_DIE",
}


describe('FSM', () => {

    beforeEach(() => {
    });

    test('tick should automatically transition between states', () => {
        function jump() {
            console.log("jumping");
        }

        function idle(): void {
            console.log("idle");
        }

        function jumpDie(): void {
            console.log("jumpDie");
        }

        function idleDie(): void {
            console.log("idleDie");
        }

        let _fsm: FSM = new FSM();

        // 创建状态
        let idleState: FSMState = new FSMState(FSMStateType.Idle);
        let jumpState: FSMState = new FSMState(FSMStateType.Jump);
        let dieState: FSMState = new FSMState(FSMStateType.Die);

        // 创建跳转
        let idleToJumpTranslation: FSMTranslation = new FSMTranslation(FSMTranslationTypeEnum.IDLE_TO_JUMP, idleState, jumpState, jump, this);
        let jumpToIdleTranslation: FSMTranslation = new FSMTranslation(FSMTranslationTypeEnum.JUMP_TO_IDLE, jumpState, idleState, idle, this);
        let jumpToDieTranslation: FSMTranslation = new FSMTranslation(FSMTranslationTypeEnum.JUMP_TO_DIE, jumpState, dieState, jumpDie, this);
        let idleToDieTranslation: FSMTranslation = new FSMTranslation(FSMTranslationTypeEnum.IDLE_TO_DIE, idleState, dieState, idleDie, this);

        // 添加状态
        _fsm.addState(idleState);
        _fsm.addState(jumpState);
        _fsm.addState(dieState);

        // 添加跳转
        _fsm.addTranslation(idleToJumpTranslation);
        _fsm.addTranslation(jumpToIdleTranslation);
        _fsm.addTranslation(idleToDieTranslation);
        _fsm.addTranslation(jumpToDieTranslation);

        _fsm.startFSM(idleState);

        _fsm.handleTransition(FSMTranslationTypeEnum.IDLE_TO_JUMP)
        _fsm.handleTransition(FSMTranslationTypeEnum.IDLE_TO_DIE)
        _fsm.handleTransition(FSMTranslationTypeEnum.JUMP_TO_DIE)
        _fsm.handleTransition(FSMTranslationTypeEnum.JUMP_TO_IDLE)

        // ---------触发事件切换状态------------------------------------------------

    })
});
