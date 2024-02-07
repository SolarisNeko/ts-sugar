// 顺序节点，依次执行所有子节点
export class BehaviorTree<BlackBoard> {


    private readonly _blackboard: BlackBoard
    protected children: BehaviorNode<BlackBoard>[] = [];
    protected _lastResult: BehaviorResult;

    constructor(blackboard: BlackBoard) {
        this._blackboard = blackboard;
    }

    get blackboard(): BlackBoard {
        return this._blackboard
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

    // 将行为树转为 JSON 字符串
    toJson(): string {
        const serializedNodes = this.children
            .map(node => this.serializeNode(node));
        return JSON.stringify({
            blackboard: this._blackboard,
            nodes: serializedNodes
        });
    }

    // 从 JSON 字符串还原行为树
    static fromJson<BlackBoard>(json: string): BehaviorTree<BlackBoard> {
        const parsedData = JSON.parse(json);

        const blackboard: BlackBoard = parsedData.blackboard;

        const tree = new BehaviorTree<BlackBoard>(blackboard);
        tree.children = parsedData.nodes
            .map((serializedNode: any) => this.deserializeNode(serializedNode));
        return tree;
    }

    // 用户注册节点的序列化函数
    private serializeNode(node: BehaviorNode<BlackBoard>): any {
        return {
            type: node.type(), // 获取节点类型
            // 节点的具体序列化数据
            data: node.serializeData(),
            children: node.getChildren()
                .map(node => this.serializeNode(node))
        };
    }

// 用户注册节点的反序列化函数
    private static deserializeNode<BlackBoard>(serializedNode: any): BehaviorNode<BlackBoard> {
        const nodeType = serializedNode.type;
        const data = serializedNode.data || {};
        const children = serializedNode.children || [];

        let factory = BehaviorTreeFactory.getFactory(nodeType);
        if (factory) {
            let newNode = factory.createNode(data);
            newNode.initFromDeserializeData(data);

            // Recursively deserialize children
            let childrenNodes = children.map((childData: any) => this.deserializeNode(childData));
            childrenNodes.forEach((child, index) => {
                newNode.addNode(child)
            })

            return newNode;
        } else {
            throw Error(`没有找到 type=${nodeType} 创建行为树节点`);
        }
    }


    getChildren() {
        return this.children
    }
}


// 工厂接口
interface BehaviorNodeFactory<BlackBoard> {
    createNode(data: any): BehaviorNode<BlackBoard>;
}

// 注册中心
class BehaviorTreeFactory {
    private static factories: Map<string, BehaviorNodeFactory<any>> = new Map();
    private static isFirstInit: boolean = false


    // 静态代码块，用于懒初始化
    static lazyInitCreator() {
        if (BehaviorTreeFactory.isFirstInit) {
            return
        }
        BehaviorTreeFactory.isFirstInit = true

        // 注册常规行为节点的工厂
        BehaviorTreeFactory.registerFactory('sequence', {
            createNode(data: any): BehaviorNode<any> {
                return new SequenceNode()
            }
        } as BehaviorNodeFactory<any>);
        BehaviorTreeFactory.registerFactory('selector', {
            createNode(data: any): BehaviorNode<any> {
                return new SelectorNode()
            }
        } as BehaviorNodeFactory<any>);
        BehaviorTreeFactory.registerFactory('action', {
            createNode(data: any): BehaviorNode<any> {
                return new ActionNode(() => {})
            }
        } as BehaviorNodeFactory<any>);
    }


    // 注册节点工厂
    static registerFactory(type: string,
                           factory: BehaviorNodeFactory<any>
    ): void {
        this.lazyInitCreator()

        this.factories.set(type, factory);
    }

    // 获取节点工厂
    static getFactory(type: string): BehaviorNodeFactory<any> | undefined {
        this.lazyInitCreator()

        return this.factories.get(type);
    }

    // 创建节点
    static createNode(type: string,
                      data: any
    ): BehaviorNode<any> {
        this.lazyInitCreator()

        const factory = this.getFactory(type);
        if (factory) {
            return factory.createNode(data);
        } else {
            throw Error(`没有找到 type=${type} 创建行为树节点`)
        }
    }
}


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

    type(): string

    getChildren(): BehaviorNode<BlackBoard>[]

    addNode(node: BehaviorNode<BlackBoard>): AbstractBehaviorNode<BlackBoard>

    removeNode(node: BehaviorNode<BlackBoard>): AbstractBehaviorNode<BlackBoard>

    update(blackboard: BlackBoard): BehaviorResult;

    // 节点的序列化函数
    serializeData(): any;

    initFromDeserializeData(data: any): void;
}

// 抽象节点
export abstract class AbstractBehaviorNode<BlackBoard> implements BehaviorNode<BlackBoard> {
    protected children: BehaviorNode<BlackBoard>[] = [];

    abstract type(): string

    getChildren(): BehaviorNode<BlackBoard>[] {
        return this.children;
    }


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

    serializeData(): any {
    }

    initFromDeserializeData(data: any): void {
    }


}

// 顺序节点，依次执行所有子节点
export class SequenceNode<BlackBoard> extends AbstractBehaviorNode<BlackBoard> {


    type(): string {
        return "sequence";
    }

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
    type(): string {
        return "selector";
    }

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

    type(): string {
        return "decorator";
    }


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

    type(): string {
        return "branch";
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
export class ActionNode<BlackBoard> extends AbstractBehaviorNode<BlackBoard> {

    type(): string {
        return "action";
    }


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