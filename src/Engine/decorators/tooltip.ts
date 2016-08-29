/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function tooltip(message: string): any {
    return (target, propertyKeys) => {
        Reflect.defineMetadata('tooltip', message, target, propertyKeys);
    }
}

function getTooltip(target: any, propertyKey: string): string {
    return Reflect.getMetadata('tooltip', target, propertyKey) || '';
}