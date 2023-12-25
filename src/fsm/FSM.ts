/**
 * 有限状态机（FSM）类
 */
export class FSM<DATA> {
    // 存储状态的映射
    private stateIdMap: Map<string, State<DATA>> = new Map();

    // 当前状态
    private curStateId!: string;

    /**
     * 创建并添加一个新的状态到状态机
     *
     * @param stateId 状态的唯一标识符
     * @param state 状态
     * @return FSM 实例
     */
    addState(stateId: string, state: State<DATA>): FSM<DATA> {
        // 记录有这么一个状态
        this.stateIdMap.set(stateId, state);
        return this;
    }

    /**
     * [用于 unit test ]
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
  * 持续调用直到出口状态或达到最大次数
  *
  * @param data 新的数据(外部处理过, 再丢进来尝试)
  * @param maxStateOccurrences 允许状态重复出现的最大次数
  * @return StateChangeResult 状态变更结果
  */
    tick(data: DATA, maxStateOccurrences: number = 2): StateChangeResult {
        const stateChangeResult: StateChangeResult = {
            stateIdSequence: [],
            exitStateId: '',
            stateIdCounterMap: new Map(),
        };

        const stateSequence: string[] = [];

        while (true) {
            const currentState = this.stateIdMap.get(this.curStateId);
            if (!currentState) {
                console.error(`No such state by stateId = ${this.curStateId}`);
                break;
            }

            // 执行逻辑
            currentState.onTick(data);

            // 重新计算状态 | 有可能和现在一样
            const newStateId = currentState.tryUpdateState(data);

            // 记录状态序列
            stateSequence.push(newStateId);

            // 记录状态出现次数
            const count = stateChangeResult.stateIdCounterMap.get(newStateId) || 0;
            stateChangeResult.stateIdCounterMap.set(newStateId, count + 1);

            // 是否和现有状态相同
            const isSameState = newStateId === this.curStateId;
            if (isSameState) {
                stateChangeResult.exitStateId = newStateId;
                break;
            }

            // switch state
            const newState = this.stateIdMap.get(newStateId);
            if (!newState) {
                console.error(`No new state to switch, newStateId = ${newStateId}`);
                break;
            }
            this.curStateId = newState.stateId;

            // old state exit
            currentState.onExit(data);

            // new state enter
            newState.onEnter(data);

            // 检查状态出现次数是否达到最大次数
            if (stateChangeResult.stateIdCounterMap.get(newStateId) === maxStateOccurrences) {
                break;
            }
        }

        stateChangeResult.stateIdSequence = stateSequence;

        return stateChangeResult;
    }


}

/**
 * 状态类，包含状态的回调函数
 */
export abstract class State<DATA> {
    // 状态唯一标识
    readonly stateId: string = '';
    // 归属的状态机
    readonly fsm: FSM<DATA> = null;

    constructor(fsm: FSM<DATA>, stateId: string) {
        this.fsm = fsm;
        this.stateId = stateId;
    }

    // 计算下一个状态, 允许返回一样的状态
    abstract tryUpdateState(data: DATA): string;

    // 进入该状态时候的回调
    abstract onEnter(data: DATA): void;

    // tick = 每一次调度 FSM 逻辑, 都会触发, 不写切换状态逻辑
    abstract onTick(data: DATA): void;

    // 当退出回调前
    abstract onExit(data: DATA): void;
}

/**
 * 状态变更结果
 */
export interface StateChangeResult {
    stateIdSequence: string[]; // 状态变更序列
    exitStateId: string; // 出口状态
    // 次数
    stateIdCounterMap: Map<String, number>; 
}
