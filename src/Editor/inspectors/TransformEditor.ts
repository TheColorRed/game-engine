/// <reference path="../../../build/gameEngine.d.ts"/>
/// <reference path="../decorators/customEditor.ts"/>

@customEditor(Transform)
class TransformEditor extends Editor {

    public onUpdate() {
        let position: string = this.findField('position');
        let rotation: string = this.findField('rotation');
        let scale: string = this.findField('scale');
        let comp = {};
        // compItem.innerHTML = `<div class="component-name">${key}</div>
        //     <div class="input-group">
        //         <div><span>X</span><span><input type="text" class="input" value="${comp[key].x}"></span></div>
        //         <div><span>Y</span><span><input type="text" class="input" value="${comp[key].y}"></span></div>
        //         <div><span>Z</span><span><input type="text" class="input" value="${comp[key].z}"></span></div>
        //     </div>`;
    }

}