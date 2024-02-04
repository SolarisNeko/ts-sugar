/**
 * 类型
 */
export type Clazz<T = any> = new (...args: any[]) => T;
