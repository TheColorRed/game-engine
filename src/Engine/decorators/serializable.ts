/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function serializable(...args): any {
    return Reflect.metadata('serializable', true);
}

function isSerializable(target: any, propertyKey: string) {
    return Reflect.getMetadata('serializable', target, propertyKey);
}