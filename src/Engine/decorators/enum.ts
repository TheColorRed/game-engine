/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function setEnum<T>(target: T): any {
    return (t, propertyKeys) => {
        Reflect.defineMetadata('enum', target, t, propertyKeys);
    };
}

function getEnum(target: any, propertyKey: string) {
    return Reflect.getMetadata('enum', target, propertyKey);
}