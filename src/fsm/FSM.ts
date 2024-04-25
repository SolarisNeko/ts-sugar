/**
 * 状态 class
 * */
export class FSMState {
    public stateId: string = null;
    //<过渡名，过渡逻辑>
    public translationMap: Map<string, FSMTranslation> = null;

    constructor(name: string) {
        this.stateId = name;
        this.translationMap = new Map<string, FSMTranslation>();
    }
}

/**
 * 跳转逻辑
 **/
export class FSMTranslation {
    // 过渡名 | 一般用 enum
    public readonly name: string = null;
    //上一个状态
    public readonly fromState: FSMState = null;
    //下一个状态
    public readonly toState: FSMState = null;
    public readonly self: any = null;

    // 状态对应的回调，如果有需要可以自己添加 EnterCallback，ExitCallback，然后在handleEvent里面调用，这里我就只写一个回调了
    public callFunction: Function = null;

    public constructor(name: string,
                       fromState: FSMState,
                       toState: FSMState,
                       callFunction: Function,
                       self: any,
    ) {
        this.name = name;
        this.fromState = fromState;
        this.toState = toState;
        this.callFunction = callFunction.bind(self);
        this.self = self

    }
}

/**
 * 状态机
 * */
export class FSM {

    // 当前状态
    private _currState: FSMState = null;
    // <stateName, State>
    public stateMap: Map<string, FSMState> = new Map<string, FSMState>();

    public get currentState(): FSMState {
        return this._currState;
    }

    public addState(state: FSMState): void {
        this.stateMap.set(state.stateId, state);
    }

    public addTranslation(translation: FSMTranslation): void {
        const fsmState: FSMState = this.stateMap.get(translation.fromState.stateId);

        // 过渡状态名
        fsmState.translationMap.set(translation.name, translation);
    }

    /** 启动状态机 */
    public startFSM(state: FSMState): void {
        this._currState = state;
    }


    /**
     * 执行过渡
     * @param transitionName
     */
    public handleTransition(transitionName: string): StateChangeResult {
        const oldState = this._currState
        if (!oldState) {
            console.error("FSM 未初始化")
            return
        }
        if (!oldState.translationMap.has(transitionName)) {
            console.warn(`FSM 中的 state = ${oldState.stateId}, 不存在 transitionName=${transitionName}`)
            return;
        }

        // 切换状态
        const newState = this._currState.translationMap.get(transitionName).toState;
        this._currState = newState;
        // 是否更新
        const changeFlag = oldState == newState

        // 条件过渡触发的逻辑
        oldState.translationMap.get(transitionName).callFunction();

        const result = new StateChangeResult();
        result.changeStateFlag = changeFlag
        result.fromStateId = oldState.stateId
        result.toStateId = newState.stateId
        return result
    }


}


/**
 * 状态变更结果
 */
export class StateChangeResult {
    // 是否变更了状态
    changeStateFlag: boolean;
    // 状态变更序列
    fromStateId: string;
    // 出口状态
    toStateId: string;
}
