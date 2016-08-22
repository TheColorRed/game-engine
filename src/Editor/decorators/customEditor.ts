/// <reference path="../../Editor/core/Globals.ts"/>
function customEditor<T>(target: T) {
    return function (editor) {
        var obj = new editor(target);
        Globals.editors.push(obj);
    }
}