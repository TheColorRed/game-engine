/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function requireComponent<T>(...args): any {
    return (constructor) => {
        Reflect.defineMetadata('requiredComponents', arguments, constructor.prototype, 'req');
    }
}