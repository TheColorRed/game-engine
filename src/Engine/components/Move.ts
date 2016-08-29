class Move extends Component {

    @range(0, 359)
    public direction: number = 0;

    public speed: number = 0;

    public update() {
        let x = Math.cos(this.direction * Math.PI / 180);
        let y = Math.sin(this.direction * Math.PI / 180);
        this.transform.translate((new Vector2(x, y)).times(this.speed).times(Time.deltaTime));
    }

}