class Vector2 {

    public x: number = 0;
    public y: number = 0;

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public times(amount: number): this {
        this.x *= amount;
        this.y *= amount;
        return this;
    }

    public dividedBy(amount: number): this {
        this.x /= amount;
        this.y /= amount;
        return this;
    }

    public plus(amount: number): this {
        this.x += amount;
        this.y += amount;
        return this;
    }

    public minus(amount: number): this {
        this.x -= amount;
        this.y -= amount;
        return this;
    }

    public static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public static get one(): Vector2 {
        return new Vector2(1, 1);
    }

    public static get up(): Vector2 {
        return new Vector2(0, 1);
    }

    public static get down(): Vector2 {
        return new Vector2(0, -1);
    }

    public static get left(): Vector2 {
        return new Vector2(-1, 0);
    }

    public static get right(): Vector2 {
        return new Vector2(1, 0);
    }

}