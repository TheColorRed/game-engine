/// <reference path="../core/Globals.ts"/>
function customEditor<T>(target: T) {
    return function (editor) {
        var obj = new editor;
        obj.target = target;
        Globals.editors.push(obj);
    }
}