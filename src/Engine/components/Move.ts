class Move extends Component {

    @range(0, 359)
    public direction: number = 0;

    public speed: number = 0;

    public update() {
        this.transform.translate(Vector2.right.times(speed).times(Time.deltaTime));
    }

}