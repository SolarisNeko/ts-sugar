/**
 * 有限状态机（FSM）类
 */
export class FSM<DATA> {
    // 存储状态的映射
    private stateIdMap: Map<string, FSMStateAbstract<DATA>> = new Map();

    // 当前状态
    private _curStateId!: string;
    // 退出的状态id
    private _exitStateId!: string;

    /**
     * 创建并添加一个新的状态到状态机
     *
     * @param stateId 状态的唯一标识符
     * @param state 状态
     * @return FSM 实例
     */
    addState(stateId: string, state: FSMStateAbstract<DATA>): FSM<DATA> {
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
        this._curStateId = state.stateId;
    }

    /**
     * 首个状态
     * @param stateId 状态的唯一标识符
     */
    enterStateId(stateId: string): FSM<DATA> {
        const state = this.stateIdMap.get(stateId);
        if (!state) {
            throw new Error(`No such stateId = ${stateId}`);
        }

        // Check mutual exclusion
        if (this._exitStateId === stateId) {
            throw new Error(`Enter stateId cannot be the same as exit stateId`);
        }

        this._curStateId = stateId;
        return this;
    }

    exitStateId(stateId: string): FSM<DATA> {
        const state = this.stateIdMap.get(stateId);
        if (!state) {
            throw new Error(`No such stateId = ${stateId}`);
        }

        // Check mutual exclusion
        if (this._curStateId === stateId) {
            throw new Error(`Exit stateId cannot be the same as current stateId`);
        }

        this._exitStateId = stateId;
        return this;
    }

    /**
     * 持续调用直到出口状态或达到最大次数
     *
     * @param data 新的数据(外部处理过, 再丢进来尝试)
     * @param maxLoopCount 最大自动 tick 次数
     * @return StateChangeResult 状态变更结果
     */
    tick(data: DATA, maxLoopCount: number = 1): FSMStateChangeResult {
        const result: FSMStateChangeResult = {
            changeStateFlag: false,
            stateIdSequence: [],
            exitStateId: '',
            tickCount: 0,
            reason: '', // Added reason field
        };

        const stateSequence: string[] = [];

        if (!this._curStateId) {
            throw new Error('没有设置初始化状态 stateId !');
        }

        if (!this._exitStateId) {
            throw new Error('没有设置初始化的出口状态 exitStateId !');
        }

        while (true) {
            const currentState = this.stateIdMap.get(this._curStateId);
            if (!currentState) {
                console.error(`No such state by stateId = ${this._curStateId}`);
                break;
            }

            // 执行逻辑
            currentState.onTick(data);

            // 获取可以过渡到的状态 ID 列表
            const canTransitionStateIds = currentState.getCanTransitionStateId();

            // 遍历获取的状态 ID 列表，判断是否满足进入条件
            for (const newStateId of canTransitionStateIds) {
                const newState = this.stateIdMap.get(newStateId);
                if (newState && newState.isCanEnterThisState(data)) {
                    // 记录状态序列
                    stateSequence.push(newStateId);

                    // 记录状态出现次数
                    result.tickCount += 1

                    // 更新最后一个状态
                    result.exitStateId = newStateId;

                    // 是否和现有状态相同
                    const isSameState = newStateId === this._curStateId;
                    if (isSameState) {
                        break;
                    }
                    // 变更了状态
                    result.changeStateFlag = true;

                    // switch state
                    this._curStateId = newState.stateId;

                    // old state exit
                    currentState.onExit(data);

                    // new state enter
                    newState.onEnter(data);

                    // 检查状态出现次数是否达到最大次数
                    if (result.tickCount === maxLoopCount) {
                        result.reason = `stateId = ${this._curStateId} 状态变更次数到达 ${maxLoopCount} 次`
                        break;
                    }

                    // 到达退出条件
                    if (this._curStateId == this._exitStateId) {
                        result.exitStateId = this._curStateId;
                        result.reason = '到达出口状态'
                        break;
                    }
                }
            }

            // 如果状态相同或者没有合适的状态可切换，退出循环
            break;
        }

        result.stateIdSequence = stateSequence;

        return result;
    }

    /**
     * 执行一次状态变更
     *
     * @param data 新的数据(外部处理过, 再丢进来尝试)
     * @return StateChangeResult 状态变更结果
     */
    tickByOneStep(data: DATA): FSMStateChangeResult {
        return this.tick(data, 1);
    }



}

/**
 * 状态类，包含状态的回调函数
 */
export abstract class FSMStateAbstract<DATA> {
    // 状态唯一标识
    readonly stateId: string = '';
    // 归属的状态机
    readonly fsm: FSM<DATA> = null;

    constructor(fsm: FSM<DATA>, stateId: string) {
        this.fsm = fsm;
        this.stateId = stateId;
    }


    // 获取可以过渡到的状态 ID 列表
    abstract getCanTransitionStateId(): string[];

    // 判断是否满足进入条件
    abstract isCanEnterThisState(data: DATA): boolean;


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
export interface FSMStateChangeResult {
    // 是否变更了状态
    changeStateFlag: boolean;
    // 状态变更序列
    stateIdSequence: string[];
    // 出口状态
    exitStateId: string;
    // tick 次数
    tickCount: number;
    // 结束原因
    reason: string;
}
