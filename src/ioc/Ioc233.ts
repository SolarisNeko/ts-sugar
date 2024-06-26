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
    private static readonly _classNameToTypeModeMap: Map<string, any> = new Map();
    // <className, instance>
    private static readonly _classNameToSingletonMap: Map<string, any> = new Map();
    // <className, 模板Class>
    private static readonly _classNameToClassMap: Map<string, Clazz<any>> = new Map();

    /**
     * 注册单例
     * @param clazz
     */
    static registerSingletonByClass<T>(clazz: Clazz<T>): void {
        this._classNameToSingletonMap.set(clazz.name, new clazz());
        this._classNameToTypeModeMap.set(clazz.name, EnumIocType233.Singleton);
    }

    static registerSingleton<T>(instance: T): void {
        let constructor = instance.constructor;
        if (constructor === undefined) {
            console.error("[Ioc233] registerSingleton error: instance.constructor is undefined")
            return;
        }
        const className = constructor.name;

        this._classNameToSingletonMap.set(className, instance);
        this._classNameToTypeModeMap.set(className, EnumIocType233.Singleton);
    }

    /**
     * 注册模板
     * @param clazz
     */
    static registerTemplateByClass<T>(clazz: Clazz<T>): void {
        this._classNameToClassMap.set(clazz.name, clazz);
        this._classNameToTypeModeMap.set(clazz.name, EnumIocType233.Template);
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
        let typeModeEnum = this._classNameToTypeModeMap.get(className);
        if (typeModeEnum === EnumIocType233.Singleton) {
            return this._classNameToSingletonMap.get(className) as T;
        }
        if (typeModeEnum === EnumIocType233.Template) {
            const template = this._classNameToClassMap.get(className);
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
            Ioc233.registerSingletonByClass(target);
        } else {
            Ioc233.registerTemplateByClass(target);
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
