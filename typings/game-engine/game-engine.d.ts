// declare var Time: GameEngine.Time;
// declare var GameObject: GameEngine.GameObject;
// declare var Obj: GameEngine.Obj;
// declare var Component: GameEngine.Component;
// declare var Behavior: GameEngine.Behavior;
// declare var MonoBehavior: GameEngine.MonoBehavior;
// declare var ObjectManager: GameEngine.ObjectManager;

// declare namespace GameEngine {

//     export interface Obj {
//         name: string;
//         isEnabled: boolean;
//         shouldDisable: boolean;
//         lastFrameEnabled: boolean;
//         getComponents(): Component[];
//         getInstanceId();
//         toString(): string;
//         destroy();
//         findObjectOfType();
//         findObjectsOfType();
//         instantiate();
//     }

//     export interface Component extends Obj {
//         options: any;
//         behavior: MonoBehavior;
//         hasStarted: boolean;
//         hasAwaken: boolean;
//         constructor(componentName?: string);
//     }

//     export interface Behavior extends Component {

//     }

//     export interface MonoBehavior extends Behavior {

//     }

//     export interface GameObject extends Obj {
//         constructor(name?: string);
//             addComponent<T extends MonoBehavior>(component: string, options?: { any }): Component;
//             getComponent(component: string): Component;
//             sendMessage(message: string);
//     }

//     export interface Time {
//         deltaTime: number;
//         time: number;
//         setDeltaTime(time: number);
//         setFrameTime(time: number);
//     }

//     export interface ObjectManager {
//         items: GameObject[];
//         setItems(items: GameObject[]);
//         addItem(item: GameObject);
//         removeItems(item: GameObject);
//     }

// }