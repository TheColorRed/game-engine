namespace GameEngine {

    export class Vector2 extends Vector3 {

        public constructor(x: number, y: number) {
            super(x, y, 0);
        }

        public static zero(): Vector2 {
            return new Vector2(0, 0);
        }

    }

}