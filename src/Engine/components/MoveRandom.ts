class MoveRandom extends Component {

    @tooltip('The speed at which the object moves')
    public speed: number = 0;

    private eventTriggered: boolean = false;

    private direction: number = 0;

    public awake() {
        this.direction = Math.round(Math.random() * 360);
    }

    public update() {
        if (!this.eventTriggered) {
            this.eventTriggered = this.eventSystem.hasEventTriggered();
        }
        if (this.eventTriggered) {
            this.updateTransform();
        }
    }

    private updateTransform() {
        let x = Math.cos(this.direction * Math.PI / 180);
        let y = Math.sin(this.direction * Math.PI / 180);
        this.transform.translate((new Vector2(x, y)).times(this.speed).times(Time.deltaTime));
    }

}