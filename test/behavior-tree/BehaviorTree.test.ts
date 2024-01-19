import {
    ActionLeafNode,
    BehaviorTree,
    BranchNode,
    DecoratorNode,
    SelectorNode,
    SequenceNode
} from "../../src/behavior-tree/BehaviorTree";

describe('BehaviorTree', () => {
    it('should execute a sequence of nodes', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const sequenceNode = new SequenceNode()
            .addNode(new ActionLeafNode(() => console.log('Action 1')))
            .addNode(new ActionLeafNode(() => console.log('Action 2')))
        ;

        tree.addNode(sequenceNode);

        const result = tree.update();
        expect(result.successFlag).toBe(true);
    });

    it('should execute a selector node', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const selectorNode = new SelectorNode();
        selectorNode.addNode(new ActionLeafNode(() => console.log('Action 1')));
        selectorNode.addNode(new ActionLeafNode(() => console.log('Action 2')));

        tree.addNode(selectorNode);

        const result = tree.update();
        expect(result.successFlag).toBe(true);
    });

    it('should execute a decorator node', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const decoratorNode = new DecoratorNode(() => true);
        decoratorNode.addNode(new ActionLeafNode(() => console.log('Action 1')));

        tree.addNode(decoratorNode);

        const result = tree.update();
        expect(result.successFlag).toBe(true);
    });

    it('should execute a branch node', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const branchNode = new BranchNode(() => 0);
        branchNode.addNode(new ActionLeafNode(() => console.log('Action 1')));

        tree.addNode(branchNode);

        const result = tree.update();
        expect(result.successFlag).toBe(true);
    });

    it('should handle an action leaf node throwing an error', () => {
        const blackboard = {}; // Your blackboard object

        const tree = new BehaviorTree<any>(blackboard);
        const actionNode = new ActionLeafNode(() => {
            throw new Error('Test Error');
        });

        tree.addNode(actionNode);

        const result = tree.update();

        expect(result.successFlag).toBe(false);
    });
});
