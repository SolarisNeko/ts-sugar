import {Clazz} from "../types/Types";

export enum EnumIocType233 {
    Singleton,
    Template,
}

/**
 * 逆转容器
 * use like
 * 1. Java SpringBoot
 * 2. Google Inject
 */
export class Ioc233 {

    // <className, typeMode>
    private static readonly classNameToTypeModeMap: Map<string, any> = new Map();
    // <className, instance>
    private static readonly singletons: Map<string, any> = new Map();
    // <className, 模板Class>
    private static readonly templates: Map<string, Clazz<any>> = new Map();

    static registerSingleton<T>(type: Clazz<T>): void {
        this.singletons.set(type.name, new type());
        this.classNameToTypeModeMap.set(type.name, EnumIocType233.Singleton);
    }

    static registerTemplate<T>(type: Clazz<T>): void {
        this.templates.set(type.name, type);
        this.classNameToTypeModeMap.set(type.name, EnumIocType233.Template);
    }

    /**
     * 从容器中获取服务实例
     * {@link Inject233}
     * 需要被标注 {@link Provider233}
     *
     * @param clazz 获取类
     */
    static getObject<T>(clazz: Clazz<T>): T {
        let className = clazz.name;
        let typeModeEnum = this.classNameToTypeModeMap.get(className);
        if (typeModeEnum === EnumIocType233.Singleton) {
            return this.singletons.get(className) as T;
        }
        if (typeModeEnum === EnumIocType233.Template) {
            const template = this.templates.get(className);
            if (!template) {
                throw new Error(`Service not found: ${className}`);
            }
            return new template() as T;
        }

        throw new Error(`[Ioc233] Service not found: ${className}`);
    }
}

// @ServiceProvider 装饰器，用于标记可注入的服务
export function Provider233(scope: EnumIocType233 = EnumIocType233.Singleton) {
    return <T extends Clazz<any>>(target: T) => {
        if (scope === EnumIocType233.Singleton) {
            Ioc233.registerSingleton(target);
        } else {
            Ioc233.registerTemplate(target);
        }
    };
}

// @Inject233 装饰器，用于注入服务
export function Inject233(serviceIdentifier: Clazz<any>) {
    return (target: any, propertyKey: string) => {
        Object.defineProperty(target, propertyKey, {
            get(): any {
                return Ioc233.getObject(serviceIdentifier);
            },
        });
    };
}
