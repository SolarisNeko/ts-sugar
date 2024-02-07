import {
    ActionNode,
    BehaviorTree,
    BranchNode,
    DecoratorNode,
    SelectorNode,
    SequenceNode
} from "../../src/behaviorTree/BehaviorTree";

describe('BehaviorTree', () => {
    it('should execute a sequence of nodes', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const sequenceNode = new SequenceNode()
            .addNode(new ActionNode(() => console.log('Action 1')))
            .addNode(new ActionNode(() => console.log('Action 2')))
        ;

        tree.addNode(sequenceNode);

        const result = tree.update();
        expect(result.successFlag).toBe(true);
    });

    it('should execute a selector node', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const selectorNode = new SelectorNode();
        selectorNode.addNode(new ActionNode(() => console.log('Action 1')));
        selectorNode.addNode(new ActionNode(() => console.log('Action 2')));

        tree.addNode(selectorNode);

        const result = tree.update();
        expect(result.successFlag).toBe(true);
    });

    it('should execute a decorator node', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const decoratorNode = new DecoratorNode(() => true);
        decoratorNode.addNode(new ActionNode(() => console.log('Action 1')));

        tree.addNode(decoratorNode);

        const result = tree.update();
        expect(result.successFlag).toBe(true);
    });

    it('should execute a branch node', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const branchNode = new BranchNode(() => 0);
        branchNode.addNode(new ActionNode(() => console.log('Action 1')));

        tree.addNode(branchNode);

        const result = tree.update();
        expect(result.successFlag).toBe(true);
    });

    it('should handle an action leaf node throwing an error', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const actionNode = new ActionNode(() => {
            throw new Error('Test Error');
        });

        tree.addNode(actionNode);

        const result = tree.update();

        expect(result.successFlag).toBe(false);
    });

    it('should serialize and deserialize a behavior tree', () => {
        // Create a sample behavior tree
        const blackboard = { /* your blackboard data */ };
        const behaviorTree = new BehaviorTree(blackboard);
        const sequenceNode = new SequenceNode();
        const actionNode = new ActionNode(blackboard => console.log('Performing action'));

        behaviorTree.addNode(sequenceNode);
        sequenceNode.addNode(actionNode);

        // Serialize the behavior tree
        const json = behaviorTree.toJson();

        // Deserialize the behavior tree
        const deserializedTree = BehaviorTree.fromJson(json);

        // Assert that the deserialized tree is equal to the original tree
        expect(deserializedTree?.blackboard).toEqual(blackboard);

        // Assert that the deserialized tree has the same number of children
        expect(deserializedTree?.getChildren().length).toBe(1);

        // Assert that the deserialized tree's child is a SequenceNode
        const deserializedChild = deserializedTree?.getChildren()[0];
        expect(deserializedChild instanceof SequenceNode).toBeTruthy();

        // Assert that the SequenceNode has the expected number of children
        expect(deserializedChild?.getChildren().length).toBe(1);

        // Assert that the child of the SequenceNode is an ActionNode
        const deserializedActionNode = deserializedChild?.getChildren()[0];
        expect(deserializedActionNode instanceof ActionNode).toBeTruthy();
    });
});
