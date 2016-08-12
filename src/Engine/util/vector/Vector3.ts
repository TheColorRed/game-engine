class Vector3 extends Vector2 {

    public z: number = 0;

    public constructor(x: number, y: number, z: number) {
        super(x, y);
    }

    public static get zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    public static get one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    public static get up(): Vector3 {
        return new Vector3(0, 1, 0);
    }

    public static get down(): Vector3 {
        return new Vector3(0, -1, 0);
    }

    public static get left(): Vector3 {
        return new Vector3(-1, 0, 0);
    }

    public static get right(): Vector3 {
        return new Vector3(1, 0, 0);
    }

    public static get back(): Vector3 {
        return new Vector3(0, 0, -1);
    }

    public static get forward(): Vector3 {
        return new Vector3(0, 0, 1);
    }

}