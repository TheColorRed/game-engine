/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function range(min: number, max: number): any {
    return (target, propertyKeys) => {
        Reflect.defineMetadata('range', `${min},${max}`, target, propertyKeys);
    }
}

function getRange(target: any, propertyKey: string) {
    return (Reflect.getMetadata('range', target, propertyKey) || '').split(',');
}