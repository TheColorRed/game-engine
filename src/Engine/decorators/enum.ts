/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function setEnum<T>(target: T): any {
    return (t, propertyKeys) => {
    // return (constructor) => {
        // console.log(target, t, propertyKeys)
        Reflect.defineMetadata('enum', target, t, propertyKeys);
        // Reflect.metadata('enum', true);
    };
}

function getEnum(target: any, propertyKey: string) {
    return Reflect.getMetadata('enum', target, propertyKey);
}