// export class NodeAnimationRunState extends State<cc.Node> {
//     constructor(fsm: FSM<cc.Node>, stateId: string) {
//         super(fsm, stateId);
//     }

//     tryUpdateState(data: cc.Node): string {
//         // Your logic to determine the next state
//         // ...

//         return nextStateId;
//     }

//     onEnter(data: cc.Node): void {
//         // Play the run animation when entering this state
//         this.playRunAnimation(data);
//     }

//     onTick(data: cc.Node): void {
//         // Your logic for each tick
//         // ...

//         // Play the run animation during each tick
//         this.playRunAnimation(data);
//     }

//     onExit(data: cc.Node): void {
//         // Play the exit animation when exiting this state
//         this.playExitAnimation(data);
//     }

//     private playRunAnimation(node: cc.Node): void {
//         // Assuming cc.Animation for Cocos Creator
//         const animationComponent = node.getComponent(cc.Animation);
//         if (animationComponent) {
//             // Replace 'RunAnimationClip' with the actual name of your run animation clip
//             animationComponent.play('RunAnimationClip');
//         } else {
//             console.error("Animation Component not found on the node.");
//         }
//     }

//     private playExitAnimation(node: cc.Node): void {
//         // Assuming cc.Animation for Cocos Creator
//         const animationComponent = node.getComponent(cc.Animation);
//         if (animationComponent) {
//             // Replace 'ExitAnimationClip' with the actual name of your exit animation clip
//             animationComponent.play('ExitAnimationClip');
//         } else {
//             console.error("Animation Component not found on the node.");
//         }
//     }
// }
