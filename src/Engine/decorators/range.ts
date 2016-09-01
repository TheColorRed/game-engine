/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function range(min: number, max: number): any {
    return (target, propertyKey) => {
        Reflect.defineMetadata('range', `${min},${max}`, target, propertyKey);
    }
}

function steps(...args): any {
    return (target, propertyKey) => {
        Reflect.defineMetadata('steps', args, target, propertyKey)
    }
}

function getRange(target: any, propertyKey: string) {
    return (Reflect.getMetadata('range', target, propertyKey) || '').split(',');
}

function getSteps(target: any, propertyKey: string) {
    return Reflect.getMetadata('steps', target, propertyKey);
}