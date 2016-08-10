class Vector3 {

    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    public constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static get zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

}