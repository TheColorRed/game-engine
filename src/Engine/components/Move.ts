class Move extends Component {

    @setEnum(Events)
    public event: Events = Events.None;

    @range(0, 359)
    @tooltip('The direction in which the object moves')
    public direction: number = 0;

    @tooltip('The speed at which the object moves')
    public speed: number = 0;

    public update() {
        if (this.eventSystem.hasEventTriggered(this.event)) {
            this.updateTransform();
        }
    }

    private updateTransform() {
        let x = Math.cos(this.direction * Math.PI / 180);
        let y = Math.sin(this.direction * Math.PI / 180);
        this.transform.translate((new Vector2(x, y)).times(this.speed).times(Time.deltaTime));
    }

}