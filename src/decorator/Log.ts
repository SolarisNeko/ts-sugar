// type Prototype = {
//     constructor: Function
// } & any

// type Constructor = { new(...args: any[]): {} };

// interface FunctionAnnotation {
//     <T>(target: Prototype, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<T>): void;
// }

// interface ConstructorAnnotation {
//     <T extends Constructor>(constructor: T): T;
// }

// interface PropertyAnnotation {
//     (target: Prototype, propertyKey: PropertyKey): void;
// }

// interface ParameterAnnotation {
//     (target: Prototype, propertyKey: PropertyKey, parameterIndex: number): void;
// }



// export function logFuncCall(): FunctionAnnotation {
//     return <FunctionAnnotation>function (target, propertyKey, descriptor) {
//         if (typeof descriptor.value === "function") {
//             let value: Function = descriptor.value;
//             // @ts-ignore
//             descriptor.value = function (...args: any) {
//                 // @ts-ignore
//                 value.logParam?.forEach(i => console.log(`第${i}参数: ${args[i]}`));
//                 return value.call(this, ...args);
//             };
//         }
//     }
//     export function logParam(): ParameterAnnotation {
//         return function (target, propertyKey, parameterIndex) {
//             target[propertyKey].logParam = [...target[propertyKey].logParam ?? [], parameterIndex];
//         };
//     }

//     class Test {
//         @logFuncCall()
//         set(@logParam() log: string) { }
//     }


//     new Test().set("aaa")