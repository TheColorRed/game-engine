namespace GameEngine {

    export class Component extends Obj {
        public options: any;
        public behavior: MonoBehavior;

        public hasStarted: boolean = false;
        public hasAwaken: boolean = false;

        public constructor(componentName?: string) {
            super();
            this.name = componentName;
        }
    }

}