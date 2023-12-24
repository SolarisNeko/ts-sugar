/**
 * 有限状态机（FSM）类
 */
class FSM<DATA> {

    // 存储状态的映射
    private stateIdMap: Map<string, State<DATA>> = new Map();

    // 当前状态
    private curStateId!: string;

    /**
     * 首个状态
     * @param stateId 状态的唯一标识符
     */
    firstStateId(stateId: string): FSM<DATA> {
        const state = this.stateIdMap.get(stateId);
        if (!state) {
            throw new Error(`No such stateId = ${stateId}`);
        }
        this.curStateId = stateId;
        return this;
    }

    /**
     * 创建并添加一个新的状态到状态机
     *
     * @param stateId 状态的唯一标识符
     * @param state 状态
     * @return FSM 实例
     */
    addState(stateId: string,
             state: State<DATA>,
    ): FSM<DATA> {
        // 记录有这么一个状态
        this.stateIdMap.set(stateId, state);
        return this;
    }

    /**
     * 切换到指定状态
     *
     * @param stateId 要切换到的状态的唯一标识符
     */
    setState(stateId: string): void {
        const state = this.stateIdMap.get(stateId);
        if (!state) {
            throw new Error(`No such state by stateId = ${stateId}`);
        }
        this.curStateId = state.stateId;
    }


    /**
     * 每一次调用都触发该函数
     * 尝试执行到下一个状态（下一个状态有可能是一样的）
     *
     * @param data 新的数据(外部处理过, 再丢进来尝试)
     * @return 是否成功切换到下一个状态
     */
    tick(data: DATA): boolean {
        // 当前状态
        const currentState = this.stateIdMap.get(this.curStateId);
        if (!currentState) {
            console.error(`No such state by stateId = ${this.curStateId}`);
            return false;
        }

        // 执行逻辑
        if (currentState.onCurrentStateTick) {
            currentState.onCurrentStateTick(data);
        }

        // 重新计算状态
        const stateCalculator = currentState.stateCalculator;
        if (!stateCalculator) {
            return false;
        }

        // 重新计算状态 | 有可能和现在一样
        const newStateId = stateCalculator(data);

        // 是否和现有状态相同
        const isSameState = newStateId === this.curStateId;
        if (isSameState) {
            return false;
        }

        // old state exit
        if (currentState.onExitCallback) {
            currentState.onExitCallback(data);
        }

        // switch state
        const newState = this.stateIdMap.get(newStateId);
        if (!newState) {
            console.error(`No new state to switch, newStateId = ${newStateId}`);
            return false;
        }
        this.curStateId = newState.stateId;

        // new state enter
        if (newState.onEnterCallback) {
            newState.onEnterCallback(data);
        }

        return true;
    }

}

/**
 * 状态类，包含状态的回调函数
 */
class State<DATA> {
    // 状态唯一标识
    readonly stateId: string = ""
    // 归属的状态机
    readonly fsm: FSM<DATA> = null

    // 尝试切换状态的状态计算器
    stateCalculator?: (data: DATA) => string;
    // 进入该状态时候的回调
    onEnterCallback?: (data: DATA) => void;
    // 当前状态每一次 tick 都触发
    onCurrentStateTick?: (data: DATA) => void;
    // 当退出回调前
    onExitCallback?: (data: DATA) => void;

    constructor(fsm: FSM<DATA>,
                stateId: string) {
        this.fsm = fsm
        this.stateId = stateId

        this.fsm.addState(stateId, this)
    }

    /**
     * 如何计算状态
     *
     * @param calculator 条件状态选择器
     * @return 当前状态的实例
     */
    howToCalculateState(calculator: (data: DATA) => string): State<DATA> {
        this.stateCalculator = calculator;
        return this;
    }

    /**
     * 设置状态的进入回调函数
     *
     * @param callback 进入回调函数
     * @return 当前状态的实例
     */
    onEnter(callback: (data: DATA) => void): State<DATA> {
        this.onEnterCallback = callback;
        return this;
    }

    /**
     * 当前状态下, 需要对 data 做什么操作
     *
     * @param action 执行回调函数
     * @return 当前状态的实例
     */
    setOnCurrentStateHandleData(action: (data: DATA) => void): State<DATA> {
        this.onCurrentStateTick = action;
        return this;
    }

    /**
     * 设置状态的退出回调函数
     *
     * @param callback 退出回调函数
     * @return 当前状态的实例
     */
    onExit(callback: (data: DATA) => void): State<DATA> {
        this.onExitCallback = callback;
        return this;
    }

    // 执行状态的进入回调函数
    executeOnEnter(data: DATA): void {
        if (this.onEnterCallback) {
            this.onEnterCallback(data);
        }
    }

    // 执行状态的处理数据回调函数
    executeOnCurrentStateHandleData(data: DATA): void {
        if (this.setOnCurrentStateHandleData) {
            this.onCurrentStateTick(data);
        }
    }

    // 执行状态的退出回调函数
    executeOnExit(data: DATA): void {
        if (this.onExitCallback) {
            this.onExitCallback(data);
        }
    }

    // 计算下一个状态
    calculateNextState(data: DATA): string | undefined {
        return this.stateCalculator ? this.stateCalculator(data) : undefined;
    }
}
