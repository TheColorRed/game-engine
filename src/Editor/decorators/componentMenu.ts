/// <reference path="../../../node_modules/reflect-metadata/Reflect.d.ts"/>

function setComponentMenu(text: string): any {
    return (constructor) => {
        Reflect.defineMetadata("componentPath", text, constructor.prototype, "class");
    }
}
function getMenuPath(target: any): any {
    return Reflect.getMetadata("componentPath", target.constructor.prototype, "class");
}