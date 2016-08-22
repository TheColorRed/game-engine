/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function range(min: number, max: number): any {
    Reflect.metadata('rangeMin', min);
    return Reflect.metadata('rangeMax', max);
}
function rangeMin(target: any, propertyKey: string) {
    return Reflect.getMetadata('rangeMin', target, propertyKey);
}
function rangeMax(target: any, propertyKey: string) {
    return Reflect.getMetadata('rangeMax', target, propertyKey);
}