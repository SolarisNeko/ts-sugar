import 'reflect-metadata';

export class ReflectUtils {

    static getAllFields(target: any): string[] {
        const fields = new Set<string>();
        let currentClass = target.constructor;

        while (currentClass !== Object) {
            const propertyNames = Reflect.ownKeys(currentClass.prototype);
            propertyNames.forEach((propertyName) => {
                if (propertyName !== 'constructor') {
                    fields.add(propertyName.toString());
                }
            });
            currentClass = Object.getPrototypeOf(currentClass.prototype).constructor;
        }

        return Array.from(fields);
    }

    static getAnnotatedFields(target: any, annotation: symbol): string[] {
        const fields = new Set<string>();
        let currentClass = target.constructor;

        while (currentClass !== Object) {
            const propertyNames = Object.getOwnPropertyNames(currentClass.prototype);
            propertyNames.forEach((propertyName) => {
                if (propertyName !== 'constructor' && Reflect.getMetadata(annotation, currentClass.prototype, propertyName)) {
                    fields.add(propertyName);
                }
            });
            currentClass = Object.getPrototypeOf(currentClass.prototype).constructor;
        }

        return Array.from(fields);
    }

}
