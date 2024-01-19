export class BehaviorResult {
    successFlag: boolean = true;
    msg: string = "";

    static success(): BehaviorResult {
        return new BehaviorResult(true, "")
    }

    static fail(msg: string): BehaviorResult {
        return new BehaviorResult(false, "")
    }

    constructor(successFlag: boolean = true,
                msg: string = ""
    ) {
        this.successFlag = successFlag;
        this.msg = msg;
    }
}

// 行为树节点接口
export interface BehaviorNode<BlackBoard> {
    addNode(node: BehaviorNode<BlackBoard>): AbstractBehaviorNode<BlackBoard>

    removeNode(node: BehaviorNode<BlackBoard>): AbstractBehaviorNode<BlackBoard>

    update(blackboard: BlackBoard): BehaviorResult;
}

// 抽象节点
export abstract class AbstractBehaviorNode<BlackBoard> implements BehaviorNode<BlackBoard> {
    protected children: BehaviorNode<BlackBoard>[] = [];

    // 添加子节点
    addNode(node: BehaviorNode<BlackBoard>): AbstractBehaviorNode<BlackBoard> {
        this.children.push(node);
        return this
    }

// 移除子节点
    removeNode(node: BehaviorNode<BlackBoard>): AbstractBehaviorNode<BlackBoard> {
        const index = this.children.indexOf(node);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
        return this;
    }

    // 更新节点，需要在子类中实现具体逻辑
    abstract update(blackboard: BlackBoard): BehaviorResult;
}

// 顺序节点，依次执行所有子节点
export class BehaviorTree<BlackBoard> {

    readonly _blackboard: BlackBoard
    protected children: BehaviorNode<BlackBoard>[] = [];
    protected _lastResult: BehaviorResult;

    constructor(blackboard: BlackBoard) {
        this._blackboard = blackboard;
    }

    // 添加子节点
    addNode(node: BehaviorNode<BlackBoard>): void {
        this.children.push(node);
    }

    update(): BehaviorResult {
        for (const child of this.children) {
            const result = child.update(this._blackboard);
            // 根据需要处理结果
            if (!result.successFlag) {
                this._lastResult = result
                return result; // 如果某个子节点失败，则整个顺序节点失败
            }
        }
        return BehaviorResult.success(); // 所有子节点都成功，整个顺序节点成功
    }
}

// 顺序节点，依次执行所有子节点
export class SequenceNode<BlackBoard> extends AbstractBehaviorNode<BlackBoard> {
    update(blackboard: BlackBoard): BehaviorResult {
        for (const child of this.children) {
            const result = child.update(blackboard);
            // 根据需要处理结果
            if (!result.successFlag) {
                return result; // 如果某个子节点失败，则整个顺序节点失败
            }
        }
        return BehaviorResult.success(); // 所有子节点都成功，整个顺序节点成功
    }
}

// 选择节点，执行第一个成功的子节点
export class SelectorNode<BlackBoard> extends AbstractBehaviorNode<BlackBoard> {
    update(blackboard: BlackBoard): BehaviorResult {
        for (const child of this.children) {
            const result = child.update(blackboard);
            // 根据子节点的结果决定是否继续执行
            if (result.successFlag) {
                // 返回第一个成功的子节点的结果
                return result;
            }
        }
        return BehaviorResult.fail("SelectorNode 全部失败");
    }
}

// 装饰节点，可用于添加额外逻辑，如条件判断
export class DecoratorNode<BlackBoard> extends AbstractBehaviorNode<BlackBoard> {
    constructor(private decorator: (blackboard: BlackBoard) => boolean) {
        super();
    }

    update(blackboard: BlackBoard): BehaviorResult {
        if (this.decorator(blackboard)) {
            // 如果装饰条件满足，执行子节点
            for (const child of this.children) {
                const result = child.update(blackboard);
                // 根据需要处理结果
                if (!result.successFlag) {
                    // 如果某个子节点失败，则整个装饰节点失败
                    return result;
                }
            }
            // 所有子节点都成功，整个装饰节点成功
            return BehaviorResult.success();
        } else {
            // 装饰条件不满足，直接返回成功
            return BehaviorResult.success();
        }
    }
}

// 分支节点，用于根据条件选择执行不同的子节点
export class BranchNode<BlackBoard> extends AbstractBehaviorNode<BlackBoard> {
    constructor(private branchSelector: (blackboard: BlackBoard) => number) {
        super();
    }

    update(blackboard: BlackBoard): BehaviorResult {
        const selectedIndex = this.branchSelector(blackboard);
        const selectedChild = this.children[selectedIndex];

        if (selectedChild) {
            // 执行选择的子节点
            return selectedChild.update(blackboard);
        } else {
            return BehaviorResult.fail("BranchNode 选择的子节点不存在");
        }
    }
}


// 行为节点，执行具体的行为
export class ActionLeafNode<BlackBoard> extends AbstractBehaviorNode<BlackBoard> {
    private action: (blackboard: BlackBoard) => void;

    constructor(action: (blackboard: BlackBoard) => void) {
        super();
        this.action = action;
    }

    update(blackboard: BlackBoard): BehaviorResult {
        try {
            this.action(blackboard);
        } catch (e) {
            return BehaviorResult.fail(`执行报错. e=${e}`)
        }

        return BehaviorResult.success();
    }
}