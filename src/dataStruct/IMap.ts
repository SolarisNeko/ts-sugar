export default interface IMap<T> {
    [index: number]: T

    [key: string]: T
}
